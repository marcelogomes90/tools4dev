import { ReactNode } from 'react';

interface InputPanelProps {
  title?: string;
  children: ReactNode;
}

export function InputPanel({ title = 'Entrada', children }: InputPanelProps) {
  return (
    <div className="rounded-2xl border border-surface-border/70 bg-surface-muted/70 p-4 shadow-card backdrop-blur">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
