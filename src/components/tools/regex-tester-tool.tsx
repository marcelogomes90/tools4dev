'use client';

import { useCallback, useMemo, useState } from 'react';
import { highlightMatches, runRegex } from '@/lib/tools/regex';
import { getToolBySlug } from '@/lib/tool-registry';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputPanel } from '@/components/ui/input-panel';
import { Label } from '@/components/ui/label';
import { OutputPanel } from '@/components/ui/output-panel';
import { Textarea } from '@/components/ui/textarea';
import { ToolLayout } from '@/components/ui/tool-layout';

const meta = getToolBySlug('regex-tester');
const samplePattern = '(tools4dev|tool)\\s+(\\w+)';
const sampleFlags = 'gi';
const sampleText = 'tools4dev and tool regex in this tool sandbox';

export function RegexTesterTool() {
    const [pattern, setPattern] = useState('');
    const [flags, setFlags] = useState('');
    const [text, setText] = useState('');

    const { result, error } = useMemo(() => {
        try {
            const matches = runRegex(pattern, flags, text);
            return { result: matches, error: '' };
        } catch (err) {
            return {
                result: [],
                error:
                    err instanceof Error
                        ? err.message
                        : 'Erro ao executar regex.',
            };
        }
    }, [pattern, flags, text]);

    const highlighted = useMemo(
        () => highlightMatches(text, result),
        [text, result],
    );
    const hasMatches = result.length > 0;

    const sample = useCallback(() => {
        setPattern(samplePattern);
        setFlags(sampleFlags);
        setText(sampleText);
    }, []);

    const clear = useCallback(() => {
        setPattern('');
        setFlags('');
        setText('');
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
                    <div className="grid gap-3 sm:grid-cols-3">
                        <div className="sm:col-span-2">
                            <Label htmlFor="regex-pattern">Regex</Label>
                            <Input
                                id="regex-pattern"
                                value={pattern}
                                onChange={(event) =>
                                    setPattern(event.target.value)
                                }
                            />
                        </div>
                        <div>
                            <Label htmlFor="regex-flags">Flags</Label>
                            <Input
                                id="regex-flags"
                                value={flags}
                                onChange={(event) =>
                                    setFlags(event.target.value)
                                }
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="regex-text">Texto</Label>
                        <Textarea
                            id="regex-text"
                            className="min-h-[240px]"
                            value={text}
                            onChange={(event) => setText(event.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button onClick={sample}>Gerar exemplo</Button>
                        <Button variant="ghost" onClick={clear}>
                            Limpar
                        </Button>
                    </div>
                    {error && <p className="text-sm text-rose-600">{error}</p>}
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                        Protecao basica: texto limitado para reduzir risco de
                        ReDoS.
                    </p>
                </InputPanel>

                <OutputPanel>
                    <div
                        className="min-h-[140px] whitespace-pre-wrap rounded-lg border border-surface-border bg-surface-muted p-3 text-sm [&_mark]:rounded [&_mark]:bg-yellow-300 [&_mark]:px-0.5 [&_mark]:text-black"
                        dangerouslySetInnerHTML={{ __html: highlighted }}
                    />
                    <div className="rounded-lg border border-surface-border bg-surface-muted p-3 text-xs">
                        {!hasMatches
                            ? 'Sem matches.'
                            : result.map((item, idx) => (
                                  <div
                                      key={`${item.index}-${idx}`}
                                      className="mb-2 rounded border border-surface-border p-2"
                                  >
                                      <p>
                                          <strong>Match:</strong> {item.match}
                                      </p>
                                      <p>
                                          <strong>Indice:</strong> {item.index}
                                      </p>
                                      <p>
                                          <strong>Grupos:</strong>{' '}
                                          {item.groups.length
                                              ? item.groups.join(', ')
                                              : 'sem grupos'}
                                      </p>
                                  </div>
                              ))}
                    </div>
                </OutputPanel>
            </div>
        </ToolLayout>
    );
}
