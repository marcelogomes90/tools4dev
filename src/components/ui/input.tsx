import { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-2xl border border-surface-border bg-surface px-3 text-sm text-surface-foreground outline-none ring-surface-accent transition placeholder:text-slate-500 focus:border-surface-accent/60 focus:ring-2 dark:placeholder:text-slate-400',
        className,
      )}
      {...props}
    />
  );
}
