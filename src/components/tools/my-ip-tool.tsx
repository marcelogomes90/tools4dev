'use client';

import { useCallback, useState } from 'react';
import { getToolBySlug } from '@/lib/tool-registry';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { InputPanel } from '@/components/ui/input-panel';
import { OutputPanel } from '@/components/ui/output-panel';
import { ToolLayout } from '@/components/ui/tool-layout';

const meta = getToolBySlug('my-ip');

interface MyIpResponse {
    ok: boolean;
    ip?: string;
    forwardedFor?: string | null;
    realIp?: string | null;
    message?: string;
}

export function MyIpTool() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<MyIpResponse | null>(null);
    const [error, setError] = useState('');

    const loadIp = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/my-ip', { cache: 'no-store' });
            const data = (await response.json()) as MyIpResponse;

            if (!response.ok || !data.ok) {
                setError(data.message ?? 'Falha ao consultar IP.');
                setResult(null);
                return;
            }

            setResult(data);
        } catch {
            setError('Falha de rede ao consultar IP.');
            setResult(null);
        } finally {
            setLoading(false);
        }
    }, []);

    if (!meta) return null;

    return (
        <ToolLayout
            title={meta.name}
            description={meta.description}
            examples={meta.examples}
        >
            <div className="grid gap-4 lg:grid-cols-2">
                <InputPanel>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                        Busca o IP visto pelo servidor (considerando headers de
                        proxy como `x-forwarded-for` e `x-real-ip`).
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <Button onClick={loadIp} disabled={loading}>
                            {loading ? 'Consultando...' : 'Consultar meu IP'}
                        </Button>
                        <Button variant="ghost" onClick={() => setResult(null)}>
                            Limpar
                        </Button>
                    </div>
                </InputPanel>

                <OutputPanel>
                    {result?.ok ? (
                        <div className="space-y-2 text-sm">
                            <p>
                                <strong>IP:</strong> {result.ip}
                            </p>
                            <p>
                                <strong>x-forwarded-for:</strong>{' '}
                                {result.forwardedFor ?? 'n/a'}
                            </p>
                            <p>
                                <strong>x-real-ip:</strong>{' '}
                                {result.realIp ?? 'n/a'}
                            </p>
                            <CopyButton
                                value={result.ip ?? ''}
                                label="Copiar IP"
                            />
                        </div>
                    ) : (
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                            {error || 'Nenhum IP consultado ainda.'}
                        </p>
                    )}
                </OutputPanel>
            </div>
        </ToolLayout>
    );
}
