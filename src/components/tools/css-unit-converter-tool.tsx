'use client';

import { useState } from 'react';
import {
    CssUnit,
    convertCssUnit,
    formatCssUnitValue,
} from '@/lib/tools/css-units';
import { getToolBySlug } from '@/lib/tool-registry';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { Input } from '@/components/ui/input';
import { InputPanel } from '@/components/ui/input-panel';
import { Label } from '@/components/ui/label';
import { OutputPanel } from '@/components/ui/output-panel';
import { Select } from '@/components/ui/select';
import { ToolLayout } from '@/components/ui/tool-layout';

const meta = getToolBySlug('css-unit-converter');

const units: CssUnit[] = ['px', 'rem', 'em', '%', 'vw', 'vh'];

function parseNumber(value: string, fallback: number) {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return fallback;
    return parsed;
}

export function CssUnitConverterTool() {
    const [value, setValue] = useState('16');
    const [from, setFrom] = useState<CssUnit>('px');
    const [to, setTo] = useState<CssUnit>('rem');
    const [rootFontSize, setRootFontSize] = useState('16');
    const [parentFontSize, setParentFontSize] = useState('16');
    const [viewportWidth, setViewportWidth] = useState('1440');
    const [viewportHeight, setViewportHeight] = useState('900');

    if (!meta) return null;

    const inputValue = parseNumber(value, 0);

    const result = convertCssUnit(inputValue, from, to, {
        rootFontSize: parseNumber(rootFontSize, 16),
        parentFontSize: parseNumber(parentFontSize, 16),
        viewportWidth: parseNumber(viewportWidth, 1440),
        viewportHeight: parseNumber(viewportHeight, 900),
    });

    const output = `${formatCssUnitValue(result)}${to}`;

    function sample() {
        setValue('24');
        setFrom('px');
        setTo('rem');
        setRootFontSize('16');
        setParentFontSize('16');
        setViewportWidth('1440');
        setViewportHeight('900');
    }

    return (
        <ToolLayout
            title={meta.name}
            description={meta.description}
            examples={meta.examples}
        >
            <div className="grid gap-4 lg:grid-cols-2">
                <InputPanel>
                    <div className="grid gap-3 sm:grid-cols-3">
                        <div className="sm:col-span-1">
                            <Label htmlFor="css-value">Valor</Label>
                            <Input
                                id="css-value"
                                value={value}
                                onChange={(event) =>
                                    setValue(event.target.value)
                                }
                            />
                        </div>
                        <div>
                            <Label htmlFor="css-from">De</Label>
                            <Select
                                id="css-from"
                                value={from}
                                onChange={(event) =>
                                    setFrom(event.target.value as CssUnit)
                                }
                            >
                                {units.map((unit) => (
                                    <option key={unit} value={unit}>
                                        {unit}
                                    </option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="css-to">Para</Label>
                            <Select
                                id="css-to"
                                value={to}
                                onChange={(event) =>
                                    setTo(event.target.value as CssUnit)
                                }
                            >
                                {units.map((unit) => (
                                    <option key={unit} value={unit}>
                                        {unit}
                                    </option>
                                ))}
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="css-root">
                                Root font-size (px)
                            </Label>
                            <Input
                                id="css-root"
                                value={rootFontSize}
                                onChange={(event) =>
                                    setRootFontSize(event.target.value)
                                }
                            />
                        </div>
                        <div>
                            <Label htmlFor="css-parent">
                                Parent font-size (px)
                            </Label>
                            <Input
                                id="css-parent"
                                value={parentFontSize}
                                onChange={(event) =>
                                    setParentFontSize(event.target.value)
                                }
                            />
                        </div>
                        <div>
                            <Label htmlFor="css-vw">Viewport width (px)</Label>
                            <Input
                                id="css-vw"
                                value={viewportWidth}
                                onChange={(event) =>
                                    setViewportWidth(event.target.value)
                                }
                            />
                        </div>
                        <div>
                            <Label htmlFor="css-vh">Viewport height (px)</Label>
                            <Input
                                id="css-vh"
                                value={viewportHeight}
                                onChange={(event) =>
                                    setViewportHeight(event.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button onClick={sample}>Gerar exemplo</Button>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400">
                        `%` e `em` usam o `parent font-size` como referência.
                    </p>
                </InputPanel>

                <OutputPanel>
                    <div className="rounded-lg border border-surface-border bg-surface-muted p-3 text-sm">
                        <p className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-400">
                            Resultado
                        </p>
                        <p className="mt-1 break-all font-mono text-xl font-semibold">
                            {output}
                        </p>
                    </div>
                    <CopyButton value={output} label="Copiar resultado" />
                </OutputPanel>
            </div>
        </ToolLayout>
    );
}
