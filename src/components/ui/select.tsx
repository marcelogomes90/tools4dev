import { SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'h-11 w-full rounded-xl border border-surface-border/80 bg-[hsl(var(--surface-input))] px-3 text-sm text-surface-foreground shadow-sm outline-none ring-surface-accent/45 transition focus:border-surface-accent/60 focus:ring-2',
        className,
      )}
      {...props}
    />
  );
}
