'use client';

import { useState } from 'react';
import { decodeBase64, encodeBase64 } from '@/lib/tools/base64';
import { getToolBySlug } from '@/lib/tool-registry';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { InputPanel } from '@/components/ui/input-panel';
import { OutputPanel } from '@/components/ui/output-panel';
import { Textarea } from '@/components/ui/textarea';
import { ToolLayout } from '@/components/ui/tool-layout';

const meta = getToolBySlug('base64-tool');

export function Base64Tool() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [urlSafe, setUrlSafe] = useState(false);
    const [error, setError] = useState('');

    if (!meta) return null;

    function clear() {
        setInput('');
        setOutput('');
        setError('');
    }

    function example() {
        setInput('Olá, dev!');
        setOutput(encodeBase64('Olá, dev!', false));
        setUrlSafe(false);
        setError('');
    }

    function onEncode() {
        try {
            setOutput(encodeBase64(input, urlSafe));
            setError('');
        } catch {
            setError('Falha ao codificar texto para base64.');
        }
    }

    function onDecode() {
        try {
            setOutput(decodeBase64(input, urlSafe));
            setError('');
        } catch {
            setError(
                'Falha ao decodificar base64. Verifique o conteudo e modo URL-safe.',
            );
        }
    }

    return (
        <ToolLayout
            title={meta.name}
            description={meta.description}
            examples={meta.examples}
        >
            <div className="grid gap-4 lg:grid-cols-2">
                <InputPanel>
                    <Textarea
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        placeholder="Digite texto ou base64"
                    />
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={urlSafe}
                            onChange={(event) =>
                                setUrlSafe(event.target.checked)
                            }
                        />
                        Modo URL-safe
                    </label>
                    <div className="flex flex-wrap gap-2">
                        <Button onClick={onEncode} disabled={!input}>
                            Encode
                        </Button>
                        <Button
                            variant="outline"
                            onClick={onDecode}
                            disabled={!input}
                        >
                            Decode
                        </Button>
                        <Button variant="outline" onClick={example}>
                            Gerar exemplo
                        </Button>
                        <Button variant="ghost" onClick={clear}>
                            Limpar
                        </Button>
                    </div>
                    {error && <p className="text-sm text-rose-600">{error}</p>}
                </InputPanel>

                <OutputPanel>
                    <pre className="min-h-[140px] whitespace-pre-wrap break-words rounded-lg border border-surface-border bg-surface-muted p-3 text-sm">
                        {output || 'Sem resultado ainda.'}
                    </pre>
                    <CopyButton value={output} />
                </OutputPanel>
            </div>
        </ToolLayout>
    );
}
