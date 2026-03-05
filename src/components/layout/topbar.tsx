'use client';

import {
  House,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';
import { toolDefinitions } from '@/lib/tool-registry';
import { ThemeToggle } from './theme-toggle';

interface TopbarProps {
  isDesktopSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  onToggleDesktopSidebar: () => void;
  onToggleMobileMenu: () => void;
}

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function Topbar({
  isDesktopSidebarOpen,
  isMobileMenuOpen,
  onToggleDesktopSidebar,
  onToggleMobileMenu,
}: TopbarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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

  const suggestions = useMemo(() => {
    const value = normalize(query);
    if (!value) return searchable.slice(0, 8);

    return searchable
      .filter(
        (tool) =>
          tool.normalizedName.includes(value) ||
          tool.normalizedSlug.includes(value) ||
          tool.path.includes(value) ||
          tool.normalizedKeywords.some((keyword) => keyword.includes(value)),
      )
      .slice(0, 8);
  }, [query, searchable]);

  function goToTool(path: string) {
    router.push(path);
    setQuery('');
    setIsSearchFocused(false);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = normalize(query);
    if (!value) {
      if (suggestions[0]) goToTool(suggestions[0].path);
      return;
    }

    const match =
      searchable.find(
        (tool) => tool.path === value || tool.normalizedSlug === value,
      ) ??
      searchable.find((tool) => tool.normalizedName.includes(value)) ??
      searchable.find((tool) =>
        tool.normalizedKeywords.some((keyword) => keyword.includes(value)),
      );

    if (match) {
      goToTool(match.path);
      return;
    }

    if (suggestions[0]) goToTool(suggestions[0].path);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-surface-border/70 bg-surface/75 backdrop-blur-xl supports-[backdrop-filter]:bg-surface/65">
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-surface-border/80 bg-surface/75 text-slate-700 shadow-sm transition hover:bg-surface-muted/75 dark:text-slate-200 lg:hidden"
          aria-label={
            isMobileMenuOpen
              ? 'Fechar menu de ferramentas'
              : 'Abrir menu de ferramentas'
          }
        >
          {isMobileMenuOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </button>
        <button
          type="button"
          onClick={onToggleDesktopSidebar}
          className="hidden h-10 w-10 items-center justify-center rounded-xl border border-surface-border/80 bg-surface/75 text-slate-700 shadow-sm transition hover:bg-surface-muted/75 dark:text-slate-200 lg:inline-flex"
          aria-label={
            isDesktopSidebarOpen ? 'Ocultar sidebar' : 'Mostrar sidebar'
          }
        >
          {isDesktopSidebarOpen ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
        </button>
        <Link
          href="/"
          aria-label="Ir para Home"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-surface-border/80 bg-surface/75 text-slate-700 shadow-sm transition hover:bg-surface-muted/75 dark:text-slate-200"
        >
          <House className="h-4 w-4" />
        </Link>
        <form onSubmit={onSubmit} className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-300" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Buscar ferramenta por nome, slug ou keyword"
            aria-label="Buscar ferramentas"
            autoComplete="off"
            className="h-10 w-full rounded-2xl border border-surface-border/80 bg-surface/80 pl-9 pr-3 text-sm text-surface-foreground shadow-sm outline-none ring-surface-accent/40 transition focus:border-surface-accent/60 focus:ring-2"
          />
          {isSearchFocused && suggestions.length > 0 && (
            <div className="absolute top-full z-50 mt-2 w-full rounded-2xl border border-surface-border/80 bg-surface/95 shadow-card backdrop-blur">
              <ul className="max-h-72 overflow-y-auto p-1">
                {suggestions.map((tool) => (
                  <li key={tool.slug}>
                    <button
                      type="button"
                      onMouseDown={(event) => {
                        event.preventDefault();
                        goToTool(tool.path);
                      }}
                      className="w-full rounded-xl px-3 py-2 text-left transition hover:bg-surface-muted/70"
                    >
                      <div className="text-sm font-medium text-surface-foreground">
                        {tool.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {tool.path}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>
        <div className="flex h-10 shrink-0 items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
