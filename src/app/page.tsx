import Link from 'next/link';
import { categories } from '@/lib/tool-registry';

const repoUrl = 'https://github.com/marcelogomes90/dev4tools';

export default function HomePage() {
  return (
    <section className="flex min-h-[calc(100vh-156px)] items-center justify-center px-2">
      <div className="w-full max-w-4xl rounded-[30px] border border-surface-border/75 bg-surface/85 p-8 text-center shadow-card backdrop-blur sm:p-12">
        <p className="mb-4 text-xs uppercase tracking-[0.24em] text-slate-600 dark:text-slate-400">
          dev4tools
        </p>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          Ferramentas essenciais para fluxo de desenvolvimento moderno
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-700 dark:text-slate-300">
          Geradores, formatadores, utilitários de segurança e compressores
          reunidos em um painel elegante e direto. Selecione qualquer
          ferramenta na barra lateral para começar.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <span
              key={category}
              className="rounded-full border border-surface-border/80 bg-surface-muted/65 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              {category}
            </span>
          ))}
        </div>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            href="/tools/json-formatter"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-surface-accent px-6 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
          >
            Abrir uma ferramenta
          </Link>
          <a
            href={repoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-surface-border/80 bg-[hsl(var(--surface-input))] px-6 text-sm font-semibold text-surface-foreground transition hover:border-surface-accent/55 hover:bg-surface-muted/55"
          >
            Dar uma estrela no GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
