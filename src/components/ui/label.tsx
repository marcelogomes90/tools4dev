import { LabelHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export function Label({
    className,
    ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
    return (
        <label
            className={cn(
                'mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200',
                className,
            )}
            {...props}
        />
    );
}
