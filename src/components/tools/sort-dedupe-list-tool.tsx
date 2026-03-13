'use client';

import { useState } from 'react';
import { sortAndDedupeList } from '@/lib/tools/list';
import { getToolBySlug } from '@/lib/tool-registry';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { InputPanel } from '@/components/ui/input-panel';
import { OutputPanel } from '@/components/ui/output-panel';
import { Textarea } from '@/components/ui/textarea';
import { ToolLayout } from '@/components/ui/tool-layout';

const meta = getToolBySlug('sort-dedupe-list');

export function SortDedupeListTool() {
    const [input, setInput] = useState(
        'banana\nmaçã\nbanana\npera\nAbacaxi\nmaçã',
    );
    const [output, setOutput] = useState('');
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [dedupe, setDedupe] = useState(true);
    const [caseSensitive, setCaseSensitive] = useState(false);
    const [numeric, setNumeric] = useState(true);
    const [removeEmpty, setRemoveEmpty] = useState(true);

    if (!meta) return null;

    function run() {
        const result = sortAndDedupeList(input, {
            order,
            dedupe,
            caseSensitive,
            numeric,
            removeEmpty,
        });

        setOutput(result.join('\n'));
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
                        className="min-h-[260px]"
                        placeholder="Uma linha por item ou separado por vírgula"
                    />
                    <div className="grid gap-2 text-sm sm:grid-cols-2">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                checked={order === 'asc'}
                                onChange={() => setOrder('asc')}
                            />
                            Ordem crescente
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                checked={order === 'desc'}
                                onChange={() => setOrder('desc')}
                            />
                            Ordem decrescente
                        </label>
                    </div>
                    <div className="grid gap-2 text-sm sm:grid-cols-2">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={dedupe}
                                onChange={(event) =>
                                    setDedupe(event.target.checked)
                                }
                            />
                            Desduplicar itens
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={caseSensitive}
                                onChange={(event) =>
                                    setCaseSensitive(event.target.checked)
                                }
                            />
                            Diferenciar maiúsculas
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={numeric}
                                onChange={(event) =>
                                    setNumeric(event.target.checked)
                                }
                            />
                            Ordenação numérica
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={removeEmpty}
                                onChange={(event) =>
                                    setRemoveEmpty(event.target.checked)
                                }
                            />
                            Remover linhas vazias
                        </label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button onClick={run}>Processar lista</Button>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setInput('');
                                setOutput('');
                            }}
                        >
                            Limpar
                        </Button>
                    </div>
                </InputPanel>

                <OutputPanel>
                    <Textarea
                        readOnly
                        value={output}
                        className="min-h-[260px]"
                        placeholder="Resultado da lista"
                    />
                    <CopyButton value={output} />
                </OutputPanel>
            </div>
        </ToolLayout>
    );
}
