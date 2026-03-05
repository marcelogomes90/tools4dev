import { TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'min-h-[120px] w-full rounded-xl border border-surface-border bg-surface p-3 text-sm text-surface-foreground outline-none ring-surface-accent transition placeholder:text-slate-500 focus:border-surface-accent/60 focus:ring-2 dark:placeholder:text-slate-400',
        className,
      )}
      {...props}
    />
  );
}
