import Link from 'next/link';
import { ToolDefinition } from '@/types/tools';
import { getToolCategories } from '@/lib/tool-registry';
import { CategoryBadge } from '@/components/ui/category-badge';

interface ToolCardProps {
  tool: ToolDefinition;
}

export function ToolCard({ tool }: ToolCardProps) {
  const categories = getToolCategories(tool);

  return (
    <Link
      href={tool.path}
      className="group rounded-2xl border border-surface-border/70 bg-surface/85 p-5 shadow-card transition hover:-translate-y-1 hover:border-surface-accent/70 hover:bg-surface"
    >
      <div className="flex flex-wrap gap-1.5">
        {categories.map((category) => (
          <CategoryBadge
            key={category}
            category={category}
            className="px-2 py-0.5 text-[10px] font-medium"
          />
        ))}
      </div>
      <h2 className="mt-2 text-lg font-semibold group-hover:text-surface-accent">
        {tool.name}
      </h2>
      <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
        {tool.description}
      </p>
      <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">
        {tool.keywords.join(' • ')}
      </p>
    </Link>
  );
}
