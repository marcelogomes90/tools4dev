import Link from 'next/link';
import { categories } from '@/lib/tool-registry';

export default function HomePage() {
  return (
    <section className="flex min-h-[calc(100vh-140px)] items-center justify-center px-2">
      <div className="w-full max-w-3xl rounded-2xl border border-surface-border bg-surface p-10 text-center shadow-card">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">
          Canivete Suico Dev
        </p>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Toolkit fullstack para o dia a dia
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-700 dark:text-slate-300">
          Geradores, formatadores, utilitarios de seguranca e compressores
          reunidos em um unico painel. Selecione qualquer ferramenta na barra
          lateral para começar.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <span
              key={category}
              className="rounded-full border border-surface-border bg-surface-muted/80 px-3 py-1 text-xs font-medium"
            >
              {category}
            </span>
          ))}
        </div>
        <div className="mt-7">
          <Link
            href="/tools/json-formatter"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-surface-accent px-5 text-sm font-semibold text-white transition hover:brightness-95"
          >
            Abrir uma ferramenta
          </Link>
        </div>
      </div>
    </section>
  );
}
