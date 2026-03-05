import { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-11 min-w-0 w-full rounded-xl border border-surface-border/80 bg-[hsl(var(--surface-input))] px-3 text-sm text-surface-foreground shadow-sm outline-none ring-surface-accent/45 transition placeholder:text-slate-500 focus:border-surface-accent/60 focus:ring-2 dark:placeholder:text-slate-400',
        className,
      )}
      {...props}
    />
  );
}
