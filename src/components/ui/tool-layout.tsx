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
    const categories = useMemo(
        () => (tool ? getToolCategories(tool) : []),
        [tool],
    );

    return (
        <section className="space-y-6">
            <header className="rounded-2xl border border-surface-border/70 bg-surface-card p-6 shadow-card">
                <div className="flex flex-wrap items-start gap-3">
                    {tool && (
                        <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-surface-accent/25 bg-surface-accent/10 text-surface-accent">
                            <ToolIcon slug={tool.slug} className="h-5 w-5" />
                        </span>
                    )}
                    <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                                {title}
                            </h1>
                            {categories.map((category) => (
                                <CategoryBadge
                                    key={category}
                                    category={category}
                                    className="px-2 py-0.5 text-[9px] font-medium"
                                />
                            ))}
                        </div>
                        <p className="max-w-3xl text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
                            {description}
                        </p>
                        {examples.length > 0 && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Exemplos: {examples.join(' • ')}
                            </p>
                        )}
                    </div>
                </div>
            </header>
            {children}
        </section>
    );
}
