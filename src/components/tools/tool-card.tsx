import Link from 'next/link';
import { ToolDefinition } from '@/types/tools';

interface ToolCardProps {
  tool: ToolDefinition;
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link
      href={tool.path}
      className="group rounded-2xl border border-surface-border/70 bg-surface/80 p-5 shadow-card transition hover:-translate-y-1 hover:border-surface-accent/80"
    >
      <p className="text-[11px] uppercase tracking-[0.13em] text-slate-600 dark:text-slate-400">{tool.category}</p>
      <h2 className="mt-2 text-lg font-semibold group-hover:text-surface-accent">{tool.name}</h2>
      <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{tool.description}</p>
      <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">{tool.keywords.join(' • ')}</p>
    </Link>
  );
}
