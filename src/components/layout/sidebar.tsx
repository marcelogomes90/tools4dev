'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { categories, toolDefinitions } from '@/lib/tool-registry';
import { cn } from '@/lib/utils/cn';

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-screen shrink-0 overflow-x-hidden overflow-y-auto border-r border-surface-border/80 bg-surface-muted px-3 py-4 transition-all duration-300 lg:block',
        isOpen ? 'w-72 opacity-100' : 'w-0 border-r-0 px-0 py-0 opacity-0',
      )}
      aria-hidden={!isOpen}
    >
      <nav className="space-y-5 pt-2">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-600 dark:text-slate-400">
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
                        className={cn(
                          'block rounded-xl px-3 py-2 text-sm transition hover:bg-surface hover:text-surface-foreground',
                          active &&
                            'bg-surface font-semibold text-surface-foreground shadow-sm',
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
  );
}
