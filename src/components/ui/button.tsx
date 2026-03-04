import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

type Variant = 'default' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({ className, variant = 'default', size = 'md', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl border font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-surface-accent disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'default' &&
          'border-transparent bg-surface-accent px-3 text-black shadow-[0_8px_20px_hsl(var(--surface-accent)/0.28)] hover:translate-y-[-1px] hover:opacity-95',
        variant === 'outline' &&
          'border-surface-border bg-surface text-surface-foreground hover:bg-surface-muted hover:border-surface-accent/60',
        variant === 'ghost' && 'border-transparent hover:bg-surface-muted',
        variant === 'danger' && 'border-transparent bg-rose-600 text-white hover:bg-rose-700',
        size === 'md' && 'h-10 px-4 text-sm',
        size === 'sm' && 'h-8 px-3 text-xs',
        className,
      )}
      {...props}
    />
  );
}
