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
import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { toolDefinitions } from '@/lib/tool-registry';
import { cn } from '@/lib/utils/cn';
import { ThemeToggle } from './theme-toggle';

interface TopbarProps {
  isDesktopSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  onToggleDesktopSidebar: () => void;
  onToggleMobileMenu: () => void;
}

interface SearchableTool {
  slug: string;
  name: string;
  path: string;
  normalizedName: string;
  normalizedSlug: string;
  normalizedPath: string;
  normalizedKeywords: string[];
  normalizedHaystack: string;
}

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function isSubsequenceMatch(text: string, query: string) {
  if (!query) return true;
  let queryIndex = 0;

  for (const character of text) {
    if (character === query[queryIndex]) {
      queryIndex += 1;
      if (queryIndex === query.length) return true;
    }
  }

  return false;
}

function tokenize(query: string) {
  return query.split(/\s+/).filter(Boolean);
}

function scoreField(field: string, token: string) {
  if (!field) return 0;
  if (field === token) return 110;
  if (field.startsWith(token)) return 80;

  const index = field.indexOf(token);
  if (index >= 0) return Math.max(55 - index, 25);

  if (isSubsequenceMatch(field, token)) return 18;
  return 0;
}

function scoreTool(tool: SearchableTool, query: string) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return 0;

  const tokens = tokenize(normalizedQuery);
  const fields = [
    tool.normalizedName,
    tool.normalizedSlug,
    tool.normalizedPath,
    ...tool.normalizedKeywords,
  ];

  let score = 0;

  for (const token of tokens) {
    let bestTokenScore = 0;
    for (const field of fields) {
      bestTokenScore = Math.max(bestTokenScore, scoreField(field, token));
    }

    if (bestTokenScore === 0) return null;
    score += bestTokenScore;
  }

  if (tool.normalizedName.includes(normalizedQuery)) score += 35;
  if (tool.normalizedSlug.includes(normalizedQuery)) score += 30;
  if (tool.normalizedPath.includes(normalizedQuery)) score += 25;
  if (tool.normalizedHaystack.includes(normalizedQuery)) score += 12;

  return score;
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
  const [activeIndex, setActiveIndex] = useState(-1);
  const suggestionsListRef = useRef<HTMLUListElement | null>(null);
  const suggestionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const searchable = useMemo(
    () =>
      toolDefinitions.map((tool) => {
        const normalizedName = normalize(tool.name);
        const normalizedSlug = normalize(tool.slug);
        const normalizedPath = normalize(tool.path);
        const normalizedKeywords = tool.keywords.map((keyword) =>
          normalize(keyword),
        );

        return {
          slug: tool.slug,
          name: tool.name,
          path: tool.path,
          normalizedName,
          normalizedSlug,
          normalizedPath,
          normalizedKeywords,
          normalizedHaystack: [
            normalizedName,
            normalizedSlug,
            normalizedPath,
            ...normalizedKeywords,
          ].join(' '),
        };
      }),
    [],
  );

  const suggestions = useMemo(() => {
    const normalizedQuery = normalize(query);

    if (!normalizedQuery) return searchable.slice(0, 8);

    return searchable
      .map((tool) => {
        const score = scoreTool(tool, normalizedQuery);
        if (score === null) return null;
        return { tool, score };
      })
      .filter((item): item is { tool: SearchableTool; score: number } =>
        Boolean(item),
      )
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.tool.name.localeCompare(b.tool.name, 'pt-BR');
      })
      .slice(0, 8)
      .map((item) => item.tool);
  }, [query, searchable]);
  const resolvedActiveIndex =
    suggestions.length === 0
      ? -1
      : Math.min(Math.max(activeIndex, 0), suggestions.length - 1);

  useEffect(() => {
    if (!isSearchFocused || resolvedActiveIndex < 0) return;
    const list = suggestionsListRef.current;
    const activeItem = suggestionRefs.current[resolvedActiveIndex];
    if (!list || !activeItem) return;

    const itemTop = activeItem.offsetTop;
    const itemBottom = itemTop + activeItem.offsetHeight;
    const listTop = list.scrollTop;
    const listBottom = listTop + list.clientHeight;

    if (itemTop < listTop) {
      list.scrollTo({ top: itemTop, behavior: 'smooth' });
      return;
    }

    if (itemBottom > listBottom) {
      list.scrollTo({
        top: itemBottom - list.clientHeight,
        behavior: 'smooth',
      });
    }
  }, [isSearchFocused, resolvedActiveIndex, suggestions.length]);

  function goToTool(path: string) {
    router.push(path);
    setQuery('');
    setIsSearchFocused(false);
    setActiveIndex(-1);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedQuery = normalize(query);
    if (!normalizedQuery) {
      if (suggestions[0]) goToTool(suggestions[0].path);
      return;
    }

    const directMatch = searchable.find(
      (tool) =>
        tool.normalizedSlug === normalizedQuery ||
        tool.normalizedPath === normalizedQuery ||
        tool.normalizedName === normalizedQuery,
    );

    if (directMatch) {
      goToTool(directMatch.path);
      return;
    }

    const selectedSuggestion =
      resolvedActiveIndex >= 0
        ? suggestions[resolvedActiveIndex]
        : suggestions[0];
    if (selectedSuggestion) goToTool(selectedSuggestion.path);
  }

  function onSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      setIsSearchFocused(false);
      setActiveIndex(-1);
      return;
    }

    if (!suggestions.length) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setIsSearchFocused(true);
      setActiveIndex((previous) =>
        previous < 0 ? 0 : (previous + 1) % suggestions.length,
      );
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setIsSearchFocused(true);
      setActiveIndex((previous) =>
        previous <= 0 ? suggestions.length - 1 : previous - 1,
      );
      return;
    }

    if (event.key === 'Enter' && resolvedActiveIndex >= 0) {
      event.preventDefault();
      const selectedSuggestion = suggestions[resolvedActiveIndex];
      if (selectedSuggestion) goToTool(selectedSuggestion.path);
    }
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
            onChange={(event) => {
              setIsSearchFocused(true);
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onFocus={() => {
              setIsSearchFocused(true);
              if (suggestions.length > 0 && activeIndex < 0) setActiveIndex(0);
            }}
            onBlur={() => {
              setIsSearchFocused(false);
              setActiveIndex(-1);
            }}
            onKeyDown={onSearchKeyDown}
            placeholder="Buscar ferramenta por nome, slug ou keyword"
            aria-label="Buscar ferramentas"
            role="combobox"
            aria-autocomplete="list"
            aria-controls="tools-search-suggestions"
            aria-expanded={isSearchFocused && suggestions.length > 0}
            aria-activedescendant={
              resolvedActiveIndex >= 0
                ? `tool-suggestion-${suggestions[resolvedActiveIndex]?.slug}`
                : undefined
            }
            autoComplete="off"
            className="h-10 w-full rounded-2xl border border-surface-border/80 bg-surface/80 pl-9 pr-3 text-sm text-surface-foreground shadow-sm outline-none ring-surface-accent/40 transition focus:border-surface-accent/60 focus:ring-2"
          />
          {isSearchFocused && suggestions.length > 0 && (
            <div className="absolute top-full z-50 mt-2 w-full rounded-2xl border border-surface-border/80 bg-surface/95 shadow-card backdrop-blur">
              <ul
                id="tools-search-suggestions"
                ref={suggestionsListRef}
                className="max-h-72 overflow-y-auto p-1"
              >
                {suggestions.map((tool, index) => (
                  <li key={tool.slug}>
                    <button
                      ref={(node) => {
                        suggestionRefs.current[index] = node;
                      }}
                      id={`tool-suggestion-${tool.slug}`}
                      type="button"
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        goToTool(tool.path);
                      }}
                      className={cn(
                        'w-full rounded-xl px-3 py-2 text-left transition hover:bg-surface-muted/70',
                        index === resolvedActiveIndex && 'bg-surface-muted/70',
                      )}
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
