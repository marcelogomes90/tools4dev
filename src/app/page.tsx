import type { Metadata } from 'next';
import Link from 'next/link';
import { categories, toolDefinitions } from '@/lib/tool-registry';
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  getHomeSeoKeywords,
  getSiteUrl,
} from '@/lib/seo';
import { CategoryBadge } from '@/components/ui/category-badge';

const repoUrl = 'https://github.com/marcelogomes90/tools4dev';
const siteUrl = getSiteUrl();
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: siteUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteUrl}/tools/{slug}`,
    'query-input': 'required name=slug',
  },
};
const featuredTools = toolDefinitions.slice(0, 8);

export const metadata: Metadata = {
  title: 'Ferramentas Online para Desenvolvedores',
  description:
    'Use ferramentas online para desenvolvimento: JSON, SQL, JWT, Regex, Base64, PDF, imagem e muito mais, sem instalação.',
  keywords: getHomeSeoKeywords(),
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="flex min-h-[calc(100vh-156px)] items-center justify-center px-2">
        <div className="w-full max-w-4xl rounded-[30px] border border-surface-border/75 bg-surface/85 p-8 text-center shadow-card backdrop-blur sm:p-12">
          <p className="mb-4 text-xs uppercase tracking-[0.24em] text-slate-600 dark:text-slate-400">
            tools4dev
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
            {categories.map((category) => {
              return <CategoryBadge key={category} category={category} />;
            })}
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
          <div className="mt-10 border-t border-surface-border/70 pt-6 text-left">
            <h2 className="text-xl font-semibold tracking-tight text-surface-foreground">
              Ferramentas Populares
            </h2>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
              Ferramentas gratuitas para tarefas comuns de desenvolvimento, com
              foco em produtividade e uso rápido no navegador.
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {featuredTools.map((tool) => (
                <li
                  key={tool.slug}
                  className="rounded-xl border border-surface-border/65 bg-surface-muted/25 p-3"
                >
                  <Link
                    href={tool.path}
                    className="text-sm font-semibold text-surface-foreground hover:underline"
                  >
                    {tool.name}
                  </Link>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                    {tool.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
