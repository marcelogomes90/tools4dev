import { TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'min-h-[120px] w-full rounded-xl border border-surface-border/80 bg-surface/90 p-3 text-sm text-surface-foreground outline-none ring-surface-accent placeholder:text-slate-500 focus:ring-2 dark:placeholder:text-slate-400',
        className,
      )}
      {...props}
    />
  );
}
