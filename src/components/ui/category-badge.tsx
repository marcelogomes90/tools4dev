import type { ToolCategory } from '@/types/tools';
import { cn } from '@/lib/utils/cn';
import { CategoryIcon } from '@/components/layout/tool-icons';

const categoryToneMap: Record<ToolCategory, string> = {
    Identidade:
        'border-sky-300/60 bg-sky-50/90 text-sky-800 dark:border-sky-700/55 dark:bg-sky-950/35 dark:text-sky-200',
    Texto: 'border-teal-300/60 bg-teal-50/90 text-teal-800 dark:border-teal-700/55 dark:bg-teal-950/35 dark:text-teal-200',
    Datas: 'border-cyan-300/60 bg-cyan-50/90 text-cyan-800 dark:border-cyan-700/55 dark:bg-cyan-950/35 dark:text-cyan-200',
    Segurança:
        'border-emerald-300/60 bg-emerald-50/90 text-emerald-800 dark:border-emerald-700/55 dark:bg-emerald-950/35 dark:text-emerald-200',
    Encoding:
        'border-indigo-300/60 bg-indigo-50/90 text-indigo-800 dark:border-indigo-700/55 dark:bg-indigo-950/35 dark:text-indigo-200',
    DevTools:
        'border-blue-300/60 bg-blue-50/90 text-blue-800 dark:border-blue-700/55 dark:bg-blue-950/35 dark:text-blue-200',
    Arquivos:
        'border-amber-300/60 bg-amber-50/90 text-amber-800 dark:border-amber-700/55 dark:bg-amber-950/35 dark:text-amber-200',
    Cores: 'border-rose-300/60 bg-rose-50/90 text-rose-800 dark:border-rose-700/55 dark:bg-rose-950/35 dark:text-rose-200',
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
