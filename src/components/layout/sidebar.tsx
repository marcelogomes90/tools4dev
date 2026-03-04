'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { categories, toolDefinitions } from '@/lib/tool-registry';
import { cn } from '@/lib/utils/cn';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-surface-border/70 bg-surface-muted/65 p-4 backdrop-blur lg:block">
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
                          'block rounded-lg px-2.5 py-2 text-sm transition hover:bg-surface/90 hover:text-surface-foreground',
                          active && 'bg-surface text-surface-foreground font-semibold shadow-sm',
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
