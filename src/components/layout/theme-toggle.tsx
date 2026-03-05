'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const isDark = isClient && resolvedTheme === 'dark';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Alternar tema"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`relative inline-flex h-10 w-[74px] items-center self-center rounded-full border px-1.5 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-surface-accent ${
        isDark
          ? 'border-cyan-400/55 bg-cyan-500/20'
          : 'border-amber-300/80 bg-amber-400/25'
      }`}
    >
      <Sun
        className={`absolute left-2.5 h-3.5 w-3.5 transition ${
          isDark ? 'text-slate-500/70' : 'text-amber-700'
        }`}
      />
      <Moon
        className={`absolute right-2.5 h-3.5 w-3.5 transition ${
          isDark ? 'text-cyan-100' : 'text-slate-500/70'
        }`}
      />
      <span
        className={`absolute left-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border shadow transition-transform ${
          isDark
            ? 'translate-x-8 border-cyan-300/60 bg-cyan-100 text-cyan-900'
            : 'translate-x-0 border-amber-200/85 bg-white text-amber-700'
        }`}
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5" />
        ) : (
          <Sun className="h-3.5 w-3.5" />
        )}
      </span>
      <span className="sr-only">Tema {isDark ? 'escuro' : 'claro'}</span>
    </button>
  );
}
