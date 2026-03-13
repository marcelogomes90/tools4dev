import { TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export function Textarea({
    className,
    ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            className={cn(
                'min-h-[120px] w-full rounded-lg border border-surface-border/70 bg-surface-input p-3 text-sm text-surface-foreground shadow-sm outline-none ring-surface-accent/40 transition-all placeholder:text-slate-400 focus:border-surface-accent/60 focus:ring-1 dark:placeholder:text-slate-500',
                className,
            )}
            {...props}
        />
    );
}
