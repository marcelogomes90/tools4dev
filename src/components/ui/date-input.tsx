import { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import { Input } from '@/components/ui/input';

export const DATE_INPUT_RESPONSIVE_CLASSNAMES =
    'w-full min-w-0 max-w-full overflow-hidden px-2 text-xs sm:text-sm md:px-3';

export function DateInput({
    className,
    ...props
}: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <Input
            type="date"
            className={cn(DATE_INPUT_RESPONSIVE_CLASSNAMES, className)}
            {...props}
        />
    );
}

