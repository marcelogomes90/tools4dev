'use client';

import { useState } from 'react';
import { downloadText } from '@/lib/utils/download';
import { getToolBySlug } from '@/lib/tool-registry';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { Input } from '@/components/ui/input';
import { InputPanel } from '@/components/ui/input-panel';
import { Label } from '@/components/ui/label';
import { OutputPanel } from '@/components/ui/output-panel';
import { Select } from '@/components/ui/select';
import { ToolLayout } from '@/components/ui/tool-layout';

const meta = getToolBySlug('name-generator');

let generateNamesPromise: Promise<typeof import('@/lib/tools/name')> | null =
    null;

function loadGenerateNames() {
    if (!generateNamesPromise) {
        generateNamesPromise = import('@/lib/tools/name');
    }

    return generateNamesPromise;
}

export function NameGeneratorTool() {
    const [amount, setAmount] = useState(10);
    const [withMiddleName, setWithMiddleName] = useState(false);
    const [locale, setLocale] = useState<'pt-BR' | 'en'>('pt-BR');
    const [result, setResult] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    if (!meta) return null;

    function clear() {
        setAmount(10);
        setWithMiddleName(false);
        setLocale('pt-BR');
        setResult([]);
        setLoading(false);
    }

    async function generate(
        nextAmount: number,
        nextWithMiddleName: boolean,
        nextLocale: 'pt-BR' | 'en',
    ) {
        setLoading(true);

        try {
            const { generateNames } = await loadGenerateNames();
            setResult(
                generateNames(nextAmount, nextWithMiddleName, nextLocale),
            );
        } finally {
            setLoading(false);
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
                        <Label htmlFor="name-amount">Quantidade (1..200)</Label>
                        <Input
                            id="name-amount"
                            type="number"
                            min={1}
                            max={200}
                            value={amount}
                            onChange={(event) =>
                                setAmount(Number(event.target.value || 1))
                            }
                        />
                    </div>
                    <div>
                        <Label htmlFor="name-locale">Idioma dos nomes</Label>
                        <Select
                            id="name-locale"
                            value={locale}
                            onChange={(event) =>
                                setLocale(event.target.value as 'pt-BR' | 'en')
                            }
                        >
                            <option value="pt-BR">Português (Brasil)</option>
                            <option value="en">English</option>
                        </Select>
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={withMiddleName}
                            onChange={(event) =>
                                setWithMiddleName(event.target.checked)
                            }
                        />
                        Incluir sobrenome do meio
                    </label>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            onClick={() =>
                                generate(amount, withMiddleName, locale)
                            }
                            disabled={loading}
                        >
                            {loading ? 'Gerando...' : 'Gerar'}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => generate(20, true, 'pt-BR')}
                            disabled={loading}
                        >
                            Gerar exemplo
                        </Button>
                        <Button variant="ghost" onClick={clear}>
                            Limpar
                        </Button>
                    </div>
                </InputPanel>

                <OutputPanel>
                    <div className="max-h-96 overflow-auto whitespace-pre-wrap rounded-lg border border-surface-border bg-surface-muted p-3 text-sm">
                        {result.length
                            ? result.join('\n')
                            : 'Nenhum nome gerado ainda.'}
                    </div>
                    <div className="flex gap-2">
                        <CopyButton
                            value={result.join('\n')}
                            label="Copiar lista"
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={result.length === 0}
                            onClick={() =>
                                downloadText(result.join('\n'), 'nomes.txt')
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
