import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

type Variant = 'default' | 'outline' | 'ghost' | 'danger' | 'primary-outline';
type Size = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
}

export function Button({
    className,
    variant = 'default',
    size = 'md',
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(
                'inline-flex items-center justify-center rounded-lg border font-semibold tracking-[0.01em] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-surface-accent disabled:cursor-not-allowed disabled:opacity-50',
                variant === 'default' &&
                    'border-transparent bg-surface-accent px-3 text-white shadow-sm hover:-translate-y-0.5 hover:bg-surface-accent-hover active:translate-y-0',
                variant === 'outline' &&
                    'border-surface-border/80 bg-surface-card text-surface-foreground shadow-sm hover:border-surface-accent/50 hover:bg-surface-muted/70',
                variant === 'primary-outline' &&
                    'border-surface-accent/60 text-surface-accent shadow-sm hover:border-surface-accent hover:bg-surface-accent/10',
                variant === 'ghost' &&
                    'border-transparent bg-transparent text-slate-600 hover:bg-surface-muted/70 hover:text-surface-foreground dark:text-slate-300 dark:hover:text-surface-foreground',
                variant === 'danger' &&
                    'border-transparent bg-rose-600 text-white shadow-sm hover:bg-rose-700',
                size === 'md' && 'h-10 px-4 text-sm',
                size === 'sm' && 'h-8 px-3 text-xs',
                className,
            )}
            {...props}
        />
    );
}
