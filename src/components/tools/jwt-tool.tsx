'use client';

import { useCallback, useState } from 'react';
import { decodeJwtUnsafe, parseJsonInput } from '@/lib/tools/jwt';
import { getToolBySlug } from '@/lib/tool-registry';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { Input } from '@/components/ui/input';
import { InputPanel } from '@/components/ui/input-panel';
import { Label } from '@/components/ui/label';
import { OutputPanel } from '@/components/ui/output-panel';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ToolLayout } from '@/components/ui/tool-layout';

const meta = getToolBySlug('jwt-tool');
const defaultHeaderJson = '{"alg":"HS256","typ":"JWT"}';
const defaultPayloadJson = '{"sub":"123","role":"admin"}';
const defaultSecret = 'my-secret';
const exampleSecret = 'super-secret';
const defaultExpiresIn = '1h';
const exampleExpiresIn = '2h';
const defaultVerifyKey = 'my-secret';

type JwtApiSuccess<T> = { ok: true } & T;
type JwtApiError = { ok: false; message: string };

function pretty(value: unknown) {
    return JSON.stringify(value, null, 2);
}

function getErrorMessage(error: unknown, fallback: string) {
    return error instanceof Error ? error.message : fallback;
}

async function postJwtApi<TSuccess extends Record<string, unknown>>(
    path: '/api/jwt/sign' | '/api/jwt/verify',
    payload: unknown,
) {
    const response = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    const data = (await response.json()) as
        | JwtApiSuccess<TSuccess>
        | JwtApiError;
    if (!response.ok || !data.ok) {
        throw new Error(
            data.ok ? 'Falha ao processar requisição JWT.' : data.message,
        );
    }

    return data;
}

export function JwtTool() {
    const [mode, setMode] = useState<'decoder' | 'encoder'>('decoder');

    const [token, setToken] = useState('');
    const [verifyKey, setVerifyKey] = useState(defaultVerifyKey);
    const [showVerifyKey, setShowVerifyKey] = useState(false);
    const [decodedOutput, setDecodedOutput] = useState('');
    const [verifyOutput, setVerifyOutput] = useState('');
    const [decoderError, setDecoderError] = useState('');

    const [headerJson, setHeaderJson] = useState(defaultHeaderJson);
    const [payloadJson, setPayloadJson] = useState(defaultPayloadJson);
    const [secret, setSecret] = useState(defaultSecret);
    const [showSecret, setShowSecret] = useState(false);
    const [algorithm, setAlgorithm] = useState<'HS256' | 'HS512'>('HS256');
    const [expiresIn, setExpiresIn] = useState(defaultExpiresIn);
    const [signedToken, setSignedToken] = useState('');
    const [encoderError, setEncoderError] = useState('');

    const [loadingVerify, setLoadingVerify] = useState(false);
    const [loadingSign, setLoadingSign] = useState(false);

    const fillExample = useCallback(() => {
        setHeaderJson(defaultHeaderJson);
        setPayloadJson('{"sub":"42","name":"tools4dev"}');
        setSecret(exampleSecret);
        setVerifyKey(exampleSecret);
        setExpiresIn(exampleExpiresIn);
        setToken('');
        setSignedToken('');
        setDecodedOutput('');
        setVerifyOutput('');
        setDecoderError('');
        setEncoderError('');
    }, []);

    const clearEncoder = useCallback(() => {
        setHeaderJson(defaultHeaderJson);
        setPayloadJson(defaultPayloadJson);
        setSecret(defaultSecret);
        setExpiresIn(defaultExpiresIn);
        setSignedToken('');
        setEncoderError('');
    }, []);

    const clearDecoder = useCallback(() => {
        setToken('');
        setVerifyKey(defaultVerifyKey);
        setDecodedOutput('');
        setVerifyOutput('');
        setDecoderError('');
    }, []);

    const decodeLocal = useCallback(() => {
        try {
            if (!token.trim())
                throw new Error('Informe token para decodificar.');
            const decoded = decodeJwtUnsafe(token.trim());
            setDecodedOutput(pretty(decoded));
            setDecoderError('');
        } catch (err) {
            setDecodedOutput('');
            setDecoderError(
                getErrorMessage(err, 'Falha ao decodificar token.'),
            );
        }
    }, [token]);

    const signServer = useCallback(async () => {
        setLoadingSign(true);
        setEncoderError('');

        try {
            const header = parseJsonInput(headerJson);
            const payload = parseJsonInput(payloadJson);

            const data = await postJwtApi<{ token: string }>('/api/jwt/sign', {
                header,
                payload,
                secret,
                algorithm,
                expiresIn,
            });

            setSignedToken(data.token);
            setToken(data.token);
            setDecoderError('');
        } catch (err) {
            setEncoderError(getErrorMessage(err, 'Erro ao assinar token.'));
        } finally {
            setLoadingSign(false);
        }
    }, [algorithm, expiresIn, headerJson, payloadJson, secret]);

    const verifyServer = useCallback(async () => {
        setLoadingVerify(true);
        setDecoderError('');

        try {
            if (!token.trim())
                throw new Error('Informe um token para validar.');

            const data = await postJwtApi<{ decoded: unknown }>(
                '/api/jwt/verify',
                {
                    token: token.trim(),
                    key: verifyKey,
                    algorithms: [algorithm],
                },
            );

            setVerifyOutput(pretty(data.decoded));
        } catch (err) {
            setVerifyOutput('');
            setDecoderError(getErrorMessage(err, 'Falha ao validar token.'));
        } finally {
            setLoadingVerify(false);
        }
    }, [algorithm, token, verifyKey]);

    if (!meta) return null;

    return (
        <ToolLayout
            title={meta.name}
            description={meta.description}
            examples={meta.examples}
        >
            <div className="space-y-4">
                <div className="inline-flex rounded-xl border border-surface-border bg-surface-muted p-1">
                    <button
                        type="button"
                        onClick={() => setMode('decoder')}
                        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                            mode === 'decoder'
                                ? 'bg-surface text-surface-foreground'
                                : 'text-slate-600 dark:text-slate-300'
                        }`}
                    >
                        Decoder
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('encoder')}
                        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                            mode === 'encoder'
                                ? 'bg-surface text-surface-foreground'
                                : 'text-slate-600 dark:text-slate-300'
                        }`}
                    >
                        Encoder
                    </button>
                </div>

                {mode === 'encoder' ? (
                    <div className="grid gap-4 lg:grid-cols-2">
                        <InputPanel title="Encoder / Sign">
                            <div>
                                <Label htmlFor="jwt-header">Header JSON</Label>
                                <Textarea
                                    id="jwt-header"
                                    className="min-h-[180px] font-mono"
                                    value={headerJson}
                                    onChange={(event) =>
                                        setHeaderJson(event.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="jwt-payload">
                                    Payload JSON
                                </Label>
                                <Textarea
                                    id="jwt-payload"
                                    className="min-h-[180px] font-mono"
                                    value={payloadJson}
                                    onChange={(event) =>
                                        setPayloadJson(event.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="jwt-secret">Secret</Label>
                                <div className="flex items-stretch gap-2">
                                    <Input
                                        id="jwt-secret"
                                        type={showSecret ? 'text' : 'password'}
                                        value={secret}
                                        onChange={(event) =>
                                            setSecret(event.target.value)
                                        }
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-11 shrink-0"
                                        onClick={() =>
                                            setShowSecret((prev) => !prev)
                                        }
                                    >
                                        {showSecret ? 'Ocultar' : 'Mostrar'}
                                    </Button>
                                </div>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div>
                                    <Label htmlFor="jwt-alg-enc">
                                        Algoritmo
                                    </Label>
                                    <Select
                                        id="jwt-alg-enc"
                                        value={algorithm}
                                        onChange={(event) =>
                                            setAlgorithm(
                                                event.target.value as
                                                    | 'HS256'
                                                    | 'HS512',
                                            )
                                        }
                                    >
                                        <option value="HS256">HS256</option>
                                        <option value="HS512">HS512</option>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="jwt-exp">Expires In</Label>
                                    <Input
                                        id="jwt-exp"
                                        value={expiresIn}
                                        onChange={(event) =>
                                            setExpiresIn(event.target.value)
                                        }
                                    />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    onClick={signServer}
                                    disabled={loadingSign}
                                >
                                    {loadingSign ? 'Processando...' : 'Sign'}
                                </Button>
                                <Button variant="outline" onClick={fillExample}>
                                    Gerar exemplo
                                </Button>
                                <Button variant="ghost" onClick={clearEncoder}>
                                    Limpar
                                </Button>
                            </div>
                            {encoderError && (
                                <p className="text-sm text-rose-600">
                                    {encoderError}
                                </p>
                            )}
                        </InputPanel>

                        <OutputPanel title="Token assinado">
                            <Textarea
                                readOnly
                                value={signedToken}
                                className="min-h-[420px] font-mono text-xs"
                                placeholder="Sem token assinado."
                            />
                            <CopyButton value={signedToken} />
                        </OutputPanel>
                    </div>
                ) : (
                    <div className="grid gap-4 lg:grid-cols-2">
                        <InputPanel title="Decoder / Verify">
                            <div>
                                <Label htmlFor="jwt-token">Token</Label>
                                <Textarea
                                    id="jwt-token"
                                    className="min-h-[220px] font-mono text-xs"
                                    value={token}
                                    onChange={(event) =>
                                        setToken(event.target.value)
                                    }
                                    placeholder="Cole o JWT aqui"
                                />
                            </div>
                            <div>
                                <Label htmlFor="jwt-verify-key">
                                    Secret/Public key para verify
                                </Label>
                                <div className="flex items-stretch gap-2">
                                    <Input
                                        id="jwt-verify-key"
                                        type={
                                            showVerifyKey ? 'text' : 'password'
                                        }
                                        value={verifyKey}
                                        onChange={(event) =>
                                            setVerifyKey(event.target.value)
                                        }
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-11 shrink-0"
                                        onClick={() =>
                                            setShowVerifyKey((prev) => !prev)
                                        }
                                    >
                                        {showVerifyKey ? 'Ocultar' : 'Mostrar'}
                                    </Button>
                                </div>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div>
                                    <Label htmlFor="jwt-alg-dec">
                                        Algoritmo para verify
                                    </Label>
                                    <Select
                                        id="jwt-alg-dec"
                                        value={algorithm}
                                        onChange={(event) =>
                                            setAlgorithm(
                                                event.target.value as
                                                    | 'HS256'
                                                    | 'HS512',
                                            )
                                        }
                                    >
                                        <option value="HS256">HS256</option>
                                        <option value="HS512">HS512</option>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button onClick={decodeLocal}>
                                    Decode (sem verify)
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={verifyServer}
                                    disabled={loadingVerify}
                                >
                                    {loadingVerify
                                        ? 'Validando...'
                                        : 'Verify assinatura'}
                                </Button>
                                <Button variant="ghost" onClick={clearDecoder}>
                                    Limpar
                                </Button>
                            </div>
                            {decoderError && (
                                <p className="text-sm text-rose-600">
                                    {decoderError}
                                </p>
                            )}
                        </InputPanel>

                        <OutputPanel title="Resultados">
                            <p className="text-xs font-semibold uppercase">
                                Decode
                            </p>
                            <Textarea
                                readOnly
                                value={decodedOutput}
                                className="min-h-[180px] font-mono text-xs"
                                placeholder="Sem resultado de decode."
                            />
                            <p className="text-xs font-semibold uppercase">
                                Verify
                            </p>
                            <Textarea
                                readOnly
                                value={verifyOutput}
                                className="min-h-[180px] font-mono text-xs"
                                placeholder="Sem resultado de verify."
                            />
                            <div className="flex gap-2">
                                <CopyButton
                                    value={decodedOutput}
                                    label="Copiar decode"
                                />
                                <CopyButton
                                    value={verifyOutput}
                                    label="Copiar verify"
                                />
                            </div>
                        </OutputPanel>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
