'use client';

import { useCallback, useMemo, useState } from 'react';
import { downloadText } from '@/lib/utils/download';
import { getToolBySlug } from '@/lib/tool-registry';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { Input } from '@/components/ui/input';
import { InputPanel } from '@/components/ui/input-panel';
import { Label } from '@/components/ui/label';
import { OutputPanel } from '@/components/ui/output-panel';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ToolLayout } from '@/components/ui/tool-layout';

const meta = getToolBySlug('sql-formatter');
const defaultLanguage = 'postgresql' as const;
const defaultIndent = 2;
const sampleSql =
  'select u.id,u.name,p.title from users u join posts p on p.user_id=u.id where u.active=true order by p.created_at desc limit 20';
type SqlLanguage = 'postgresql' | 'mysql' | 'sqlite';

export function SqlFormatterTool() {
  const [sql, setSql] = useState('');
  const [language, setLanguage] = useState<SqlLanguage>(defaultLanguage);
  const [uppercase, setUppercase] = useState(true);
  const [indent, setIndent] = useState(defaultIndent);
  const [formatted, setFormatted] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const canRun = useMemo(() => Boolean(sql.trim()) && !loading, [loading, sql]);

  const run = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/sql/format', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql, language, uppercase, indent }),
      });

      const data = (await response.json()) as
        | { ok: true; formatted: string }
        | { ok: false; message: string };

      if (!response.ok || !data.ok) {
        setError(data.ok ? 'Erro ao formatar SQL.' : data.message);
        setFormatted('');
        return;
      }

      setFormatted(data.formatted);
    } catch {
      setError('Falha de rede ao formatar SQL.');
      setFormatted('');
    } finally {
      setLoading(false);
    }
  }, [indent, language, sql, uppercase]);

  const sample = useCallback(() => {
    setSql(sampleSql);
    setLanguage(defaultLanguage);
    setUppercase(true);
    setIndent(defaultIndent);
  }, []);

  const clear = useCallback(() => {
    setSql('');
    setFormatted('');
    setError('');
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
            value={sql}
            onChange={(event) => setSql(event.target.value)}
            className="min-h-[320px] font-mono"
            placeholder="Cole sua query SQL"
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <Label>Dialect</Label>
              <Select
                value={language}
                onChange={(event) =>
                  setLanguage(event.target.value as SqlLanguage)
                }
              >
                <option value="postgresql">PostgreSQL</option>
                <option value="mysql">MySQL</option>
                <option value="sqlite">SQLite</option>
              </Select>
            </div>
            <div>
              <Label>Indent size</Label>
              <Input
                type="number"
                min={2}
                max={8}
                value={indent}
                onChange={(event) =>
                  setIndent(Number(event.target.value || defaultIndent))
                }
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={uppercase}
                  onChange={(event) => setUppercase(event.target.checked)}
                />
                Keywords em caixa alta
              </label>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={run} disabled={!canRun}>
              {loading ? 'Formatando...' : 'Formatar'}
            </Button>
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
            value={formatted}
            className="min-h-[320px] font-mono"
            placeholder="SQL formatado"
          />
          <div className="flex gap-2">
            <CopyButton value={formatted} />
            <Button
              variant="outline"
              size="sm"
              disabled={!formatted}
              onClick={() => downloadText(formatted, 'formatted.sql')}
            >
              Baixar
            </Button>
          </div>
        </OutputPanel>
      </div>
    </ToolLayout>
  );
}
