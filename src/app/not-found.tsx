import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl space-y-4 rounded-2xl border border-surface-border/75 bg-surface/85 px-6 py-12 text-center shadow-card">
      <h1 className="text-2xl font-bold">Pagina não encontrada</h1>
      <p className="text-sm text-slate-700 dark:text-slate-300">
        A rota solicitada não existe. Volte para o painel principal.
      </p>
      <Link
        href="/"
        className="inline-flex h-10 items-center justify-center rounded-xl bg-surface-accent px-4 text-sm font-semibold text-white transition hover:brightness-95"
      >
        Ir para Home
      </Link>
    </div>
  );
}
