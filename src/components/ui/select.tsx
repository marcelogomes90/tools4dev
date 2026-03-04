import { SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'h-11 w-full rounded-xl border border-surface-border/80 bg-surface/90 px-3 text-sm text-surface-foreground outline-none ring-surface-accent focus:ring-2',
        className,
      )}
      {...props}
    />
  );
}
