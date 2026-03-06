'use client';

import { ReactNode, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { CategoryBadge } from '@/components/ui/category-badge';
import { getToolCategories, toolsByPath } from '@/lib/tool-registry';
import { ToolIcon } from '@/components/layout/tool-icons';

interface ToolLayoutProps {
  title: string;
  description: string;
  examples?: string[];
  children: ReactNode;
}

export function ToolLayout({
  title,
  description,
  examples = [],
  children,
}: ToolLayoutProps) {
  const pathname = usePathname();
  const tool = useMemo(() => toolsByPath.get(pathname), [pathname]);
  const categories = useMemo(() => (tool ? getToolCategories(tool) : []), [tool]);

  return (
    <section className="space-y-6">
      <header className="space-y-2 rounded-2xl border border-surface-border/75 bg-surface/85 p-6 shadow-card">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex min-w-0 items-center gap-2">
            {tool && (
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-surface-border/70 bg-surface-muted/65 text-slate-700 dark:text-slate-200">
                <ToolIcon slug={tool.slug} className="h-4 w-4" />
              </span>
            )}
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              {title}
            </h1>
          </div>
          {categories.map((category) => (
            <CategoryBadge
              key={category}
              category={category}
              className="px-2 py-0.5` text-[9px] font-medium"
            />
          ))}
        </div>
        <p className="max-w-3xl text-sm text-slate-700 dark:text-slate-300">
          {description}
        </p>
        {examples.length > 0 && (
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Exemplos: {examples.join(' • ')}
          </p>
        )}
      </header>
      {children}
    </section>
  );
}
