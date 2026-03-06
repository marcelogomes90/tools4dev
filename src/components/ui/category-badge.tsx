import type { ToolCategory } from '@/types/tools';
import { cn } from '@/lib/utils/cn';
import { CategoryIcon } from '@/components/layout/tool-icons';

const categoryToneMap: Record<ToolCategory, string> = {
  Identidade:
    'border-sky-300/70 bg-sky-100/80 text-sky-800 dark:border-sky-700/70 dark:bg-sky-950/45 dark:text-sky-200',
  Texto:
    'border-teal-300/70 bg-teal-100/80 text-teal-800 dark:border-teal-700/70 dark:bg-teal-950/45 dark:text-teal-200',
  Datas:
    'border-cyan-300/70 bg-cyan-100/80 text-cyan-800 dark:border-cyan-700/70 dark:bg-cyan-950/45 dark:text-cyan-200',
  Segurança:
    'border-emerald-300/70 bg-emerald-100/80 text-emerald-800 dark:border-emerald-700/70 dark:bg-emerald-950/45 dark:text-emerald-200',
  Encoding:
    'border-indigo-300/70 bg-indigo-100/80 text-indigo-800 dark:border-indigo-700/70 dark:bg-indigo-950/45 dark:text-indigo-200',
  DevTools:
    'border-blue-300/70 bg-blue-100/80 text-blue-800 dark:border-blue-700/70 dark:bg-blue-950/45 dark:text-blue-200',
  Arquivos:
    'border-amber-300/70 bg-amber-100/80 text-amber-800 dark:border-amber-700/70 dark:bg-amber-950/45 dark:text-amber-200',
  Cores:
    'border-rose-300/70 bg-rose-100/80 text-rose-800 dark:border-rose-700/70 dark:bg-rose-950/45 dark:text-rose-200',
};

interface CategoryBadgeProps {
  category: ToolCategory;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold',
        categoryToneMap[category],
        className,
      )}
    >
      <CategoryIcon category={category} className="h-3.5 w-3.5" />
      {category}
    </span>
  );
}
