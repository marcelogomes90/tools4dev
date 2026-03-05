'use client';

import { useMemo, useState } from 'react';
import {
  hexToRgb,
  hslToRgb,
  hsvToRgb,
  isHexColor,
  rgbToHex,
  rgbToHsl,
  rgbToHsv,
} from '@/lib/tools/color';
import { getToolBySlug } from '@/lib/tool-registry';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { Input } from '@/components/ui/input';
import { InputPanel } from '@/components/ui/input-panel';
import { Label } from '@/components/ui/label';
import { OutputPanel } from '@/components/ui/output-panel';
import { Select } from '@/components/ui/select';
import { ToolLayout } from '@/components/ui/tool-layout';

const meta = getToolBySlug('color-converter');

type InputType = 'hex' | 'rgb' | 'hsl' | 'hsv';

  function parseNumbers(value: string, expected: number) {
  const normalized = value
    .replace(/rgba?|hsla?|hsva?/gi, '')
    .replace(/[()]/g, '')
    .trim();

  const numbers = normalized
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => Number(part.replace('%', '')));

  if (
    numbers.length !== expected ||
    numbers.some((item) => Number.isNaN(item))
  ) {
    throw new Error('Formato inválido. Use valores separados por vírgula.');
  }

  return numbers;
}

export function ColorConverterTool() {
  const [formState, setFormState] = useState<{
    inputType: InputType;
    inputValue: string;
  }>({
    inputType: 'hex',
    inputValue: '#ff9900',
  });
  const { inputType, inputValue } = formState;

  const { computed, error } = useMemo(() => {
    if (!inputValue.trim()) {
      return { computed: null, error: '' };
    }

    try {
      const rgb = (() => {
        if (inputType === 'hex') return hexToRgb(inputValue);

        if (inputType === 'rgb') {
          const [r, g, b] = parseNumbers(inputValue, 3);
          if ([r, g, b].some((value) => value < 0 || value > 255)) {
            throw new Error(
              'RGB inválido. Cada canal deve ficar entre 0 e 255.',
            );
          }
          return { r, g, b };
        }

        if (inputType === 'hsl') {
          const [h, s, l] = parseNumbers(inputValue, 3);
          if (h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100) {
            throw new Error(
              'HSL inválido. Use H(0..360), S(0..100), L(0..100).',
            );
          }
          return hslToRgb({ h, s, l });
        }

        const [h, s, v] = parseNumbers(inputValue, 3);
        if (h < 0 || h > 360 || s < 0 || s > 100 || v < 0 || v > 100) {
          throw new Error('HSV inválido. Use H(0..360), S(0..100), V(0..100).');
        }
        return hsvToRgb({ h, s, v });
      })();

      const hex = rgbToHex(rgb);
      const hsl = rgbToHsl(rgb);
      const hsv = rgbToHsv(rgb);

      return {
        computed: {
          hex,
          rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
          hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
          hsv: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
        },
        error: '',
      };
    } catch (err) {
      return {
        computed: null,
        error: err instanceof Error ? err.message : 'Cor inválida.',
      };
    }
  }, [inputType, inputValue]);

  function sample() {
    if (inputType === 'hex')
      setFormState((state) => ({ ...state, inputValue: '#34d399' }));
    if (inputType === 'rgb')
      setFormState((state) => ({ ...state, inputValue: '52, 211, 153' }));
    if (inputType === 'hsl')
      setFormState((state) => ({ ...state, inputValue: '158, 64, 52' }));
    if (inputType === 'hsv')
      setFormState((state) => ({ ...state, inputValue: '158, 75, 83' }));
  }

  function updateFromPicker(value: string) {
    if (isHexColor(value)) {
      setFormState((state) => ({ ...state, inputValue: value }));
    }
  }

  function changeInputType(type: InputType) {
    setFormState({
      inputType: type,
      inputValue: '',
    });
  }

  if (!meta) return null;

  return (
    <ToolLayout
      title={meta.name}
      description={meta.description}
      examples={meta.examples}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <InputPanel>
          <div>
            <Label htmlFor="input-type">Formato de entrada</Label>
            <Select
              id="input-type"
              value={inputType}
              onChange={(event) =>
                changeInputType(event.target.value as InputType)
              }
            >
              <option value="hex">HEX</option>
              <option value="rgb">RGB</option>
              <option value="hsl">HSL</option>
              <option value="hsv">HSV</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="color-input">Valor</Label>
            <Input
              id="color-input"
              value={inputValue}
              onChange={(event) =>
                setFormState((state) => ({
                  ...state,
                  inputValue: event.target.value,
                }))
              }
              placeholder={
                inputType === 'hex'
                  ? '#RRGGBB'
                  : inputType === 'rgb'
                    ? '255, 153, 0'
                    : inputType === 'hsl'
                      ? '36, 100, 50'
                      : '36, 100, 100'
              }
            />
          </div>
          {inputType === 'hex' && (
            <div>
              <Label htmlFor="picker">Color picker</Label>
              <input
                id="picker"
                type="color"
                className="h-12 w-full max-w-full cursor-pointer rounded-lg border border-surface-border bg-surface p-1"
                value={computed?.hex ?? '#000000'}
                onChange={(event) => updateFromPicker(event.target.value)}
              />
            </div>
          )}
          <div className="flex gap-2">
            <Button onClick={sample}>Gerar exemplo</Button>
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
        </InputPanel>

        <OutputPanel>
          {computed ? (
            <div className="space-y-3 text-sm">
              <div
                className="h-20 rounded-lg border border-surface-border"
                style={{ backgroundColor: computed.hex }}
              />
              <p className="break-all">
                <strong>HEX:</strong> {computed.hex}
              </p>
              <p className="break-all">
                <strong>RGB:</strong> {computed.rgb}
              </p>
              <p className="break-all">
                <strong>HSL:</strong> {computed.hsl}
              </p>
              <p className="break-all">
                <strong>HSV:</strong> {computed.hsv}
              </p>
              <div className="flex flex-wrap gap-2">
                <CopyButton value={computed.hex} label="Copiar HEX" />
                <CopyButton value={computed.rgb} label="Copiar RGB" />
                <CopyButton value={computed.hsl} label="Copiar HSL" />
                <CopyButton value={computed.hsv} label="Copiar HSV" />
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Sem resultado válido.
            </p>
          )}
        </OutputPanel>
      </div>
    </ToolLayout>
  );
}
