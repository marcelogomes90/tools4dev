'use client';

import { useState } from 'react';
import { daysBetweenDates } from '@/lib/tools/date';
import { getToolBySlug } from '@/lib/tool-registry';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputPanel } from '@/components/ui/input-panel';
import { Label } from '@/components/ui/label';
import { OutputPanel } from '@/components/ui/output-panel';
import { ToolLayout } from '@/components/ui/tool-layout';

const meta = getToolBySlug('days-between-dates');

export function DaysBetweenDatesTool() {
    const [start, setStart] = useState('2026-01-01');
    const [end, setEnd] = useState('2026-03-01');
    const [inclusive, setInclusive] = useState(false);
    const [result, setResult] = useState<number | null>(null);
    const [error, setError] = useState('');

    if (!meta) return null;

    function calculate() {
        try {
            setResult(daysBetweenDates(start, end, inclusive));
            setError('');
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Falha ao calcular período.',
            );
            setResult(null);
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
                    <div>
                        <Label htmlFor="days-start">Data inicial</Label>
                        <Input
                            id="days-start"
                            type="date"
                            className="min-w-0"
                            value={start}
                            onChange={(event) => setStart(event.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="days-end">Data final</Label>
                        <Input
                            id="days-end"
                            type="date"
                            className="min-w-0"
                            value={end}
                            onChange={(event) => setEnd(event.target.value)}
                        />
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={inclusive}
                            onChange={(event) =>
                                setInclusive(event.target.checked)
                            }
                        />
                        Contagem inclusiva (inclui data inicial e final)
                    </label>
                    <div className="flex flex-wrap gap-2">
                        <Button onClick={calculate}>Calcular</Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setStart('2025-12-25');
                                setEnd('2026-01-10');
                            }}
                        >
                            Gerar exemplo
                        </Button>
                    </div>
                    {error && <p className="text-sm text-rose-600">{error}</p>}
                </InputPanel>

                <OutputPanel>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                        {result !== null
                            ? `Diferença: ${result} dia(s).`
                            : 'Nenhum cálculo executado.'}
                    </p>
                </OutputPanel>
            </div>
        </ToolLayout>
    );
}
