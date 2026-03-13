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
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { toolDefinitions } from '@/lib/tool-registry';
import { cn } from '@/lib/utils/cn';
import { ThemeToggle } from './theme-toggle';
import { ToolIcon } from './tool-icons';

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

const ptBrCollator = new Intl.Collator('pt-BR');

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

function scoreTool(
    tool: SearchableTool,
    normalizedQuery: string,
    tokens: string[],
) {
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

const searchableTools: SearchableTool[] = toolDefinitions.map((tool) => {
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
});

const directPathByQuery = new Map<string, string>();
for (const tool of searchableTools) {
    if (!directPathByQuery.has(tool.normalizedSlug)) {
        directPathByQuery.set(tool.normalizedSlug, tool.path);
    }

    if (!directPathByQuery.has(tool.normalizedPath)) {
        directPathByQuery.set(tool.normalizedPath, tool.path);
    }

    if (!directPathByQuery.has(tool.normalizedName)) {
        directPathByQuery.set(tool.normalizedName, tool.path);
    }
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

    const suggestions = useMemo(() => {
        const normalizedQuery = normalize(query);
        if (!normalizedQuery) return searchableTools.slice(0, 8);
        const tokens = tokenize(normalizedQuery);

        return searchableTools
            .map((tool) => {
                const score = scoreTool(tool, normalizedQuery, tokens);
                if (score === null) return null;
                return { tool, score };
            })
            .filter((item): item is { tool: SearchableTool; score: number } =>
                Boolean(item),
            )
            .sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                return ptBrCollator.compare(a.tool.name, b.tool.name);
            })
            .slice(0, 8)
            .map((item) => item.tool);
    }, [query]);
    const resolvedActiveIndex =
        suggestions.length === 0
            ? -1
            : Math.min(Math.max(activeIndex, 0), suggestions.length - 1);

    useEffect(() => {
        suggestionRefs.current = suggestionRefs.current.slice(
            0,
            suggestions.length,
        );
    }, [suggestions.length]);

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

    const goToTool = useCallback(
        (path: string) => {
            router.push(path);
            setQuery('');
            setIsSearchFocused(false);
            setActiveIndex(-1);
        },
        [router],
    );

    function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const normalizedQuery = normalize(query);
        if (!normalizedQuery) {
            if (suggestions[0]) goToTool(suggestions[0].path);
            return;
        }

        const directMatchPath = directPathByQuery.get(normalizedQuery);
        if (directMatchPath) {
            goToTool(directMatchPath);
            return;
        }

        const selectedSuggestion =
            resolvedActiveIndex >= 0
                ? suggestions[resolvedActiveIndex]
                : suggestions[0];
        if (selectedSuggestion) goToTool(selectedSuggestion.path);
    }

    const onSearchChange = useCallback(
        (value: string) => {
            setIsSearchFocused(true);
            setQuery(value);
            setActiveIndex(0);
        },
        [setQuery],
    );

    const onSearchFocus = useCallback(() => {
        setIsSearchFocused(true);
        if (suggestions.length > 0 && activeIndex < 0) setActiveIndex(0);
    }, [activeIndex, suggestions.length]);

    const onSearchBlur = useCallback(() => {
        setIsSearchFocused(false);
        setActiveIndex(-1);
    }, []);

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
        <header className="sticky top-0 z-40 border-b border-surface-border/50 bg-surface-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-surface-card/70">
            <div className="mx-auto flex max-w-[1400px] items-center gap-2.5 px-4 py-3 sm:px-6 lg:px-8">
                <button
                    type="button"
                    onClick={onToggleMobileMenu}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border/70 bg-surface-card text-slate-600 shadow-sm transition-all hover:border-surface-accent/40 hover:bg-surface-muted/75 hover:text-surface-foreground dark:text-slate-300 lg:hidden"
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
                    className="hidden h-9 w-9 items-center justify-center rounded-lg border border-surface-border/70 bg-surface-card text-slate-600 shadow-sm transition-all hover:border-surface-accent/40 hover:bg-surface-muted/75 hover:text-surface-foreground dark:text-slate-300 lg:inline-flex"
                    aria-label={
                        isDesktopSidebarOpen
                            ? 'Ocultar sidebar'
                            : 'Mostrar sidebar'
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
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-surface-border/70 bg-surface-card text-slate-600 shadow-sm transition-all hover:border-surface-accent/40 hover:bg-surface-muted/75 hover:text-surface-foreground dark:text-slate-300"
                >
                    <House className="h-4 w-4" />
                </Link>
                <form onSubmit={onSubmit} className="relative min-w-0 flex-1">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input
                        value={query}
                        onChange={(event) => onSearchChange(event.target.value)}
                        onFocus={onSearchFocus}
                        onBlur={onSearchBlur}
                        onKeyDown={onSearchKeyDown}
                        placeholder="Buscar ferramenta..."
                        aria-label="Buscar ferramentas"
                        role="combobox"
                        aria-autocomplete="list"
                        aria-controls="tools-search-suggestions"
                        aria-expanded={
                            isSearchFocused && suggestions.length > 0
                        }
                        aria-activedescendant={
                            resolvedActiveIndex >= 0
                                ? `tool-suggestion-${suggestions[resolvedActiveIndex]?.slug}`
                                : undefined
                        }
                        autoComplete="off"
                        className="h-9 w-full rounded-full border border-surface-border/70 bg-surface-card pl-9 pr-4 text-sm text-surface-foreground shadow-sm outline-none ring-surface-accent/35 transition-all placeholder:text-slate-400 focus:border-surface-accent/55 focus:ring-1 dark:placeholder:text-slate-500"
                    />
                    {isSearchFocused && suggestions.length > 0 && (
                        <div className="absolute top-full z-50 mt-2 w-full rounded-2xl border border-surface-border/70 bg-surface-card shadow-card backdrop-blur-xl">
                            <ul
                                id="tools-search-suggestions"
                                ref={suggestionsListRef}
                                className="max-h-72 overflow-y-auto p-1.5"
                            >
                                {suggestions.map((tool, index) => {
                                    return (
                                        <li key={tool.slug}>
                                            <button
                                                ref={(node) => {
                                                    suggestionRefs.current[
                                                        index
                                                    ] = node;
                                                }}
                                                id={`tool-suggestion-${tool.slug}`}
                                                type="button"
                                                onMouseEnter={() =>
                                                    setActiveIndex(index)
                                                }
                                                onMouseDown={(event) => {
                                                    event.preventDefault();
                                                    goToTool(tool.path);
                                                }}
                                                className={cn(
                                                    'w-full rounded-lg px-3 py-2 text-left transition-all hover:bg-surface-muted/70',
                                                    index ===
                                                        resolvedActiveIndex &&
                                                        'bg-surface-accent/8 text-surface-accent',
                                                )}
                                            >
                                                <div className="flex items-center gap-2 text-sm font-medium text-surface-foreground">
                                                    <ToolIcon
                                                        slug={tool.slug}
                                                        className={cn(
                                                            'h-3.5 w-3.5 shrink-0',
                                                            index ===
                                                                resolvedActiveIndex
                                                                ? 'text-surface-accent'
                                                                : 'text-slate-500',
                                                        )}
                                                    />
                                                    <span>{tool.name}</span>
                                                </div>
                                                <div className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                                                    {tool.path}
                                                </div>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </form>
                <div className="flex h-9 shrink-0 items-center">
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
