import { ReactNode } from 'react';

interface ToolLayoutProps {
  title: string;
  description: string;
  examples?: string[];
  children: ReactNode;
}

export function ToolLayout({
  title,
  description,
  examples = [],
  children,
}: ToolLayoutProps) {
  return (
    <section className="space-y-6">
      <header className="space-y-2 rounded-2xl border border-surface-border/75 bg-surface/85 p-6 shadow-card">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {title}
        </h1>
        <p className="max-w-3xl text-sm text-slate-700 dark:text-slate-300">
          {description}
        </p>
        {examples.length > 0 && (
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Exemplos: {examples.join(' • ')}
          </p>
        )}
      </header>
      {children}
    </section>
  );
}
