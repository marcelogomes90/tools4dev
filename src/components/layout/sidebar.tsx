'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { categories, toolDefinitions } from '@/lib/tool-registry';
import { cn } from '@/lib/utils/cn';

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
  const activeTool = toolDefinitions.find((tool) => pathname === tool.path);

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[2px] transition-opacity lg:hidden',
          isMobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onCloseMobile}
        aria-hidden
      />
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-[19rem] shrink-0 overflow-x-hidden overflow-y-auto border-r border-surface-border/60 bg-surface shadow-card backdrop-blur-xl transition-transform duration-300 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:shadow-none lg:transition-all',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
          isDesktopOpen
            ? 'lg:w-[19rem] lg:opacity-100'
            : 'lg:w-0 lg:border-r-0 lg:opacity-0',
          'lg:translate-x-0',
        )}
      >
        <div className="sticky -top-px z-10 flex h-[65px] flex-col bg-surface px-3 pb-1 pt-4">
          <p className="px-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-800 dark:text-slate-100">
            Ferramentas
          </p>
          <p className="mt-1 truncate px-3 text-[11px] font-medium text-slate-500 dark:text-slate-300">
            {activeTool?.name ?? 'Selecione uma ferramenta'}
          </p>
        </div>
        <nav className="space-y-6 px-3 py-4">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                {category}
              </h3>
              <ul className="space-y-1">
                {toolDefinitions
                  .filter((tool) => tool.category === category)
                  .map((tool) => {
                    const active = pathname === tool.path;
                    return (
                      <li key={tool.slug}>
                        <Link
                          href={tool.path}
                          onClick={onNavigate}
                          className={cn(
                            'block rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-surface-muted/85 hover:text-surface-foreground dark:text-slate-200',
                            active &&
                              'bg-surface font-semibold text-surface-foreground shadow-sm ring-1 ring-surface-border/70',
                          )}
                        >
                          {tool.name}
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
