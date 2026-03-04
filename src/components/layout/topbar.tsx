'use client';

import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';

export function Topbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-surface-border/70 bg-surface/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-200 lg:hidden">
          Canivete Suico Dev
        </Link>
        <div className="hidden text-xs uppercase tracking-[0.16em] text-slate-600 dark:text-slate-400 lg:block">
          Ferramentas para fluxo de desenvolvimento
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
