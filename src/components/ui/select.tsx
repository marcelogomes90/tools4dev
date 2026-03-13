import { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function Select({
    className,
    ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <div className="relative w-full">
            <select
                className={cn(
                    'h-11 w-full appearance-none rounded-xl border border-surface-border/80 bg-[hsl(var(--surface-input))] px-3 pr-11 text-sm text-surface-foreground shadow-sm outline-none ring-surface-accent/45 transition focus:border-surface-accent/60 focus:ring-2',
                    className,
                )}
                {...props}
            />
            <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-surface-foreground/60"
            />
        </div>
    );
}
