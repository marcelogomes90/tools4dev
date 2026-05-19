import { ReactNode } from 'react';

interface OutputPanelProps {
    title?: string;
    children: ReactNode;
}

export function OutputPanel({
    title = 'Resultado',
    children,
}: OutputPanelProps) {
    return (
        <div className="rounded-2xl border border-surface-border/65 bg-surface-card/92 p-5 shadow-card backdrop-blur">
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">
                {title}
            </h2>
            <div aria-live="polite" className="space-y-3">
                {children}
            </div>
        </div>
    );
}
