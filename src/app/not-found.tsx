import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl space-y-4 py-14 text-center">
      <h1 className="text-2xl font-bold">Pagina nao encontrada</h1>
      <p className="text-sm text-slate-700 dark:text-slate-300">
        A rota solicitada nao existe. Volte para o painel principal.
      </p>
      <Link
        href="/"
        className="inline-flex h-10 items-center justify-center rounded-xl bg-surface-accent px-4 text-sm font-medium text-black hover:opacity-90"
      >
        Ir para Home
      </Link>
    </div>
  );
}
