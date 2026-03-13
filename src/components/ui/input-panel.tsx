import { ReactNode } from 'react';

interface InputPanelProps {
    title?: string;
    children: ReactNode;
}

export function InputPanel({ title = 'Entrada', children }: InputPanelProps) {
    return (
        <div className="rounded-2xl border border-surface-border/70 bg-surface-card p-5 shadow-card">
            <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                {title}
            </h2>
            <div className="space-y-3">{children}</div>
        </div>
    );
}
