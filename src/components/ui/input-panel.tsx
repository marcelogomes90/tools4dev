import { ReactNode } from 'react';

interface InputPanelProps {
  title?: string;
  children: ReactNode;
}

export function InputPanel({ title = 'Entrada', children }: InputPanelProps) {
  return (
    <div className="rounded-3xl border border-surface-border bg-surface p-5 shadow-card">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
