import Link from 'next/link';
import { ToolDefinition } from '@/types/tools';
import { getToolCategories } from '@/lib/tool-registry';
import { CategoryBadge } from '@/components/ui/category-badge';
import { ToolIcon } from '@/components/layout/tool-icons';

interface ToolCardProps {
    tool: ToolDefinition;
}

export function ToolCard({ tool }: ToolCardProps) {
    const categories = getToolCategories(tool);

    return (
        <Link
            href={tool.path}
            className="group flex flex-col rounded-2xl border border-surface-border/70 bg-surface-card p-5 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-surface-accent/60 hover:shadow-lg"
        >
            <div className="mb-3 flex items-center gap-3">
                <span className="group-hover:bg-surface-accent/8 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-surface-border/60 bg-surface-muted/60 text-slate-600 transition-colors group-hover:border-surface-accent/30 group-hover:text-surface-accent dark:text-slate-300">
                    <ToolIcon slug={tool.slug} className="h-4 w-4" />
                </span>
                <div className="flex min-w-0 flex-wrap gap-1">
                    {categories.map((category) => (
                        <CategoryBadge
                            key={category}
                            category={category}
                            className="px-2 py-0.5 text-[10px] font-medium"
                        />
                    ))}
                </div>
            </div>
            <h2 className="text-base font-semibold tracking-tight text-surface-foreground transition-colors group-hover:text-surface-accent">
                {tool.name}
            </h2>
            <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {tool.description}
            </p>
            <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
                {tool.keywords.join(' · ')}
            </p>
        </Link>
    );
}
