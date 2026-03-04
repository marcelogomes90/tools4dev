import { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-xl border border-surface-border/80 bg-surface/90 px-3 text-sm text-surface-foreground outline-none ring-surface-accent placeholder:text-slate-500 focus:ring-2 dark:placeholder:text-slate-400',
        className,
      )}
      {...props}
    />
  );
}
