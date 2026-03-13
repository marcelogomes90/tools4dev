import { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export function Input({
    className,
    ...props
}: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            className={cn(
                'h-10 w-full min-w-0 rounded-lg border border-surface-border/70 bg-surface-input px-3 text-sm text-surface-foreground shadow-sm outline-none ring-surface-accent/40 transition-all placeholder:text-slate-400 focus:border-surface-accent/60 focus:ring-1 dark:placeholder:text-slate-500',
                className,
            )}
            {...props}
        />
    );
}
