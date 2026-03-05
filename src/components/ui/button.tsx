import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

type Variant = 'default' | 'outline' | 'ghost' | 'danger';
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
        'inline-flex items-center justify-center rounded-xl border font-semibold tracking-[0.01em] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-surface-accent disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'default' &&
          'border-transparent bg-surface-accent px-3 text-white shadow-sm hover:-translate-y-0.5 hover:brightness-95 active:translate-y-0',
        variant === 'outline' &&
          'border-surface-border/80 bg-surface text-surface-foreground shadow-sm hover:border-surface-accent/45 hover:bg-surface-muted/70',
        variant === 'ghost' &&
          'border-transparent bg-transparent text-slate-700 hover:bg-surface-muted/70 dark:text-slate-200',
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
