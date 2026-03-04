'use client';

import { PanelLeftClose, PanelLeftOpen, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';
import { toolDefinitions } from '@/lib/tool-registry';
import { ThemeToggle } from './theme-toggle';

interface TopbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

function normalize(value: string) {
  return value.toLowerCase().trim();
}

export function Topbar({ isSidebarOpen, onToggleSidebar }: TopbarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const searchable = useMemo(
    () =>
      toolDefinitions.map((tool) => ({
        ...tool,
        normalizedName: normalize(tool.name),
        normalizedSlug: normalize(tool.slug),
        normalizedKeywords: tool.keywords.map((keyword) => normalize(keyword)),
      })),
    [],
  );

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = normalize(query);
    if (!value) return;

    const match =
      searchable.find(
        (tool) => tool.path === value || tool.normalizedSlug === value,
      ) ??
      searchable.find((tool) => tool.normalizedName.includes(value)) ??
      searchable.find((tool) =>
        tool.normalizedKeywords.some((keyword) => keyword.includes(value)),
      );

    if (!match) return;
    router.push(match.path);
    setQuery('');
  }

  return (
    <header className="sticky top-0 z-40 border-b border-surface-border/80 bg-surface/95">
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="hidden h-10 w-10 items-center justify-center rounded-xl border border-surface-border bg-surface-muted text-slate-700 transition hover:bg-surface dark:text-slate-200 lg:inline-flex"
          aria-label={isSidebarOpen ? 'Ocultar sidebar' : 'Mostrar sidebar'}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
        </button>
        <Link
          href="/"
          className="hidden shrink-0 text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-200 sm:block lg:hidden"
        >
          Canivete Suico Dev
        </Link>
        <form onSubmit={onSubmit} className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
          <input
            list="tool-search-options"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar ferramenta por nome, slug ou keyword"
            className="h-10 w-full rounded-2xl border border-surface-border bg-surface-muted pl-9 pr-3 text-sm text-surface-foreground outline-none ring-surface-accent transition focus:border-surface-accent/60 focus:ring-2"
          />
          <datalist id="tool-search-options">
            {toolDefinitions.map((tool) => (
              <option key={tool.slug} value={tool.name} />
            ))}
          </datalist>
        </form>
        <div className="flex h-10 shrink-0 items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
