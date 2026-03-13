'use client';

import { useState } from 'react';
import { removeAccents } from '@/lib/tools/text-accents';
import { getToolBySlug } from '@/lib/tool-registry';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { InputPanel } from '@/components/ui/input-panel';
import { OutputPanel } from '@/components/ui/output-panel';
import { Textarea } from '@/components/ui/textarea';
import { ToolLayout } from '@/components/ui/tool-layout';

const meta = getToolBySlug('remove-accents');

export function RemoveAccentsTool() {
    const [input, setInput] = useState(
        'Ação rápida com acentuação em português.',
    );
    const [output, setOutput] = useState('');

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
                        className="min-h-[260px]"
                        placeholder="Digite o texto com acentos"
                    />
                    <div className="flex flex-wrap gap-2">
                        <Button onClick={() => setOutput(removeAccents(input))}>
                            Remover acentos
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() =>
                                setInput('Olá, João! São Paulo é incrível.')
                            }
                        >
                            Gerar exemplo
                        </Button>
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
                        placeholder="Resultado sem acentos"
                    />
                    <CopyButton value={output} />
                </OutputPanel>
            </div>
        </ToolLayout>
    );
}
