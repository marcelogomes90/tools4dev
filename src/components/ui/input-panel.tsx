import { ReactNode } from 'react';

interface InputPanelProps {
    title?: string;
    children: ReactNode;
}

export function InputPanel({ title = 'Entrada', children }: InputPanelProps) {
    return (
        <div className="rounded-2xl border border-surface-border/65 bg-surface-card/92 p-4 shadow-card backdrop-blur sm:p-5">
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">
                {title}
            </h2>
            <div className="space-y-3">{children}</div>
        </div>
    );
}
