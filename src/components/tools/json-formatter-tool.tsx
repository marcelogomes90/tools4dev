'use client';

import { useCallback, useState } from 'react';
import { formatJson } from '@/lib/tools/json';
import { downloadText } from '@/lib/utils/download';
import { getToolBySlug } from '@/lib/tool-registry';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { InputPanel } from '@/components/ui/input-panel';
import { OutputPanel } from '@/components/ui/output-panel';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ToolLayout } from '@/components/ui/tool-layout';

const meta = getToolBySlug('json-formatter');
const defaultIndent: 2 | 4 = 2;
const sampleInput = '{"z":3,"a":{"x":1,"w":2},"arr":[{"b":2,"a":1}]}';

export function JsonFormatterTool() {
    const [input, setInput] = useState('');
    const [indent, setIndent] = useState<2 | 4>(defaultIndent);
    const [sortKeys, setSortKeys] = useState(false);
    const [minify, setMinify] = useState(false);
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');

    const applyFormat = useCallback(
        (
            nextInput: string,
            options?: {
                nextIndent?: 2 | 4;
                nextSortKeys?: boolean;
                nextMinify?: boolean;
            },
        ) => {
            const result = formatJson(nextInput, {
                indent: options?.nextIndent ?? indent,
                minify: options?.nextMinify ?? minify,
                sortKeys: options?.nextSortKeys ?? sortKeys,
            });
            return result;
        },
        [indent, minify, sortKeys],
    );

    const run = useCallback(() => {
        const result = applyFormat(input);
        if (!result.ok) {
            setError(result.error);
            setOutput('');
            return;
        }

        setOutput(result.output);
        setError('');
    }, [applyFormat, input]);

    const sample = useCallback(() => {
        setInput(sampleInput);
        const result = applyFormat(sampleInput, {
            nextIndent: defaultIndent,
            nextSortKeys: true,
            nextMinify: false,
        });
        if (result.ok) setOutput(result.output);
        setSortKeys(true);
        setMinify(false);
        setIndent(defaultIndent);
        setError('');
    }, [applyFormat]);

    const clear = useCallback(() => {
        setInput('');
        setOutput('');
        setError('');
        setSortKeys(false);
        setMinify(false);
        setIndent(defaultIndent);
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
                    <Textarea
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        className="min-h-[320px] font-mono"
                        placeholder="Cole seu JSON aqui"
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Indentacao
                            </label>
                            <Select
                                value={String(indent)}
                                onChange={(event) =>
                                    setIndent(
                                        Number(event.target.value) as 2 | 4,
                                    )
                                }
                            >
                                <option value="2">2 espacos</option>
                                <option value="4">4 espacos</option>
                            </Select>
                        </div>
                        <div className="flex items-end gap-4 pb-2 text-sm">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={sortKeys}
                                    onChange={(event) =>
                                        setSortKeys(event.target.checked)
                                    }
                                />
                                Ordenar chaves
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={minify}
                                    onChange={(event) =>
                                        setMinify(event.target.checked)
                                    }
                                />
                                Minify
                            </label>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button onClick={run}>Formatar</Button>
                        <Button variant="outline" onClick={sample}>
                            Gerar exemplo
                        </Button>
                        <Button variant="ghost" onClick={clear}>
                            Limpar
                        </Button>
                    </div>
                    {error && <p className="text-sm text-rose-600">{error}</p>}
                </InputPanel>

                <OutputPanel>
                    <Textarea
                        readOnly
                        value={output}
                        className="min-h-[320px] font-mono"
                        placeholder="Resultado formatado aparece aqui"
                    />
                    <div className="flex gap-2">
                        <CopyButton value={output} />
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!output}
                            onClick={() =>
                                downloadText(
                                    output,
                                    'formatted.json',
                                    'application/json;charset=utf-8',
                                )
                            }
                        >
                            Baixar
                        </Button>
                    </div>
                </OutputPanel>
            </div>
        </ToolLayout>
    );
}
