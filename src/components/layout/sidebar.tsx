'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { toolsByCategory, toolsByPath } from '@/lib/tool-registry';
import { cn } from '@/lib/utils/cn';
import { CategoryIcon, ToolIcon } from './tool-icons';

interface SidebarProps {
    isDesktopOpen: boolean;
    isMobileOpen: boolean;
    onCloseMobile: () => void;
    onNavigate: () => void;
}

export function Sidebar({
    isDesktopOpen,
    isMobileOpen,
    onCloseMobile,
    onNavigate,
}: SidebarProps) {
    const pathname = usePathname();
    const activeTool = toolsByPath.get(pathname);

    return (
        <>
            <div
                className={cn(
                    'fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[2px] transition-opacity lg:hidden',
                    isMobileOpen
                        ? 'opacity-100'
                        : 'pointer-events-none opacity-0',
                )}
                onClick={onCloseMobile}
                aria-hidden
            />
            <aside
                className={cn(
                    'sidebar-scroll fixed inset-y-0 left-0 z-50 w-[19.75rem] shrink-0 overflow-y-auto overflow-x-hidden border-r border-surface-border/50 bg-surface-card shadow-card backdrop-blur-xl transition-transform duration-300 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:shadow-none lg:transition-all',
                    isMobileOpen ? 'translate-x-0' : '-translate-x-full',
                    isDesktopOpen
                        ? 'lg:w-[19.75rem] lg:opacity-100'
                        : 'lg:w-0 lg:border-r-0 lg:opacity-0',
                    'lg:translate-x-0',
                )}
            >
                <div className="sticky -top-px z-10 flex min-h-[76px] flex-col border-b border-surface-border/40 bg-surface-card px-3 pb-3 pt-4">
                    <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                        Ferramentas
                    </p>
                    <p className="mt-1.5 flex items-center gap-2 truncate px-3 text-[13px] font-semibold text-surface-foreground">
                        {activeTool && (
                            <ToolIcon
                                slug={activeTool.slug}
                                className="h-3.5 w-3.5 shrink-0 text-surface-accent"
                            />
                        )}
                        <span className="truncate">
                            {activeTool?.name ?? 'Selecione uma ferramenta'}
                        </span>
                    </p>
                </div>
                <nav className="space-y-5 px-3 py-4">
                    {toolsByCategory.map(({ category, tools }) => {
                        return (
                            <div key={category}>
                                <h3 className="mb-1.5 flex items-center gap-2 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                                    <CategoryIcon
                                        category={category}
                                        className="h-3 w-3 shrink-0"
                                    />
                                    <span>{category}</span>
                                </h3>
                                <ul className="space-y-0.5">
                                    {tools.map((tool) => {
                                        const active = pathname === tool.path;
                                        return (
                                            <li key={tool.slug}>
                                                <Link
                                                    href={tool.path}
                                                    onClick={onNavigate}
                                                    className={cn(
                                                        'flex items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] font-medium text-slate-600 transition-all duration-100 hover:bg-surface-muted/80 hover:text-surface-foreground dark:text-slate-300',
                                                        active &&
                                                            'bg-surface-accent/10 font-semibold text-surface-accent hover:bg-surface-accent/15 hover:text-surface-accent',
                                                    )}
                                                >
                                                    <ToolIcon
                                                        slug={tool.slug}
                                                        className={cn(
                                                            'h-3.5 w-3.5 shrink-0',
                                                            active
                                                                ? 'text-surface-accent'
                                                                : 'text-slate-500 dark:text-slate-400',
                                                        )}
                                                    />
                                                    <span className="truncate">
                                                        {tool.name}
                                                    </span>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
