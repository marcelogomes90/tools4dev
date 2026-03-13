import type { Metadata } from 'next';
import Link from 'next/link';
import { categories, toolDefinitions } from '@/lib/tool-registry';
import {
    SITE_DESCRIPTION,
    SITE_NAME,
    getHomeSeoKeywords,
    getPublicSiteUrl,
} from '@/lib/seo';
import { CategoryBadge } from '@/components/ui/category-badge';

const repoUrl = 'https://github.com/marcelogomes90/tools4dev';
const siteUrl = getPublicSiteUrl();
const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    ...(siteUrl ? { url: siteUrl } : {}),
};
const featuredTools = toolDefinitions.slice(0, 9);
const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: featuredTools.map((tool, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: tool.name,
        description: tool.description,
        url: siteUrl ? `${siteUrl}${tool.path}` : tool.path,
    })),
};

export const metadata: Metadata = {
    title: 'Ferramentas Online para Desenvolvedores',
    description:
        'Ferramentas online grátis para devs: formatador JSON/SQL, JWT, Regex, Base64, geradores, compressores e utilitários no navegador.',
    keywords: getHomeSeoKeywords(),
    alternates: siteUrl
        ? {
              canonical: '/',
          }
        : undefined,
    openGraph: {
        title: 'Ferramentas Online para Desenvolvedores',
        description:
            'Ferramentas online grátis para devs: formatador JSON/SQL, JWT, Regex, Base64, geradores, compressores e utilitários no navegador.',
        type: 'website',
        ...(siteUrl ? { url: siteUrl } : {}),
        ...(siteUrl
            ? {
                  images: [
                      {
                          url: `${siteUrl}/developer.png`,
                          width: 1200,
                          height: 630,
                          alt: 'tools4dev',
                      },
                  ],
              }
            : {}),
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Ferramentas Online para Desenvolvedores',
        description:
            'Ferramentas online grátis para devs: formatador JSON/SQL, JWT, Regex, Base64, geradores, compressores e utilitários no navegador.',
        ...(siteUrl ? { images: [`${siteUrl}/developer.png`] } : {}),
    },
};

export default function HomePage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(itemListJsonLd),
                }}
            />
            <section className="flex min-h-[calc(100vh-156px)] items-center justify-center px-2 py-8">
                <div className="w-full max-w-5xl rounded-[28px] border border-surface-border/70 bg-surface-card p-8 text-center shadow-card backdrop-blur sm:p-12">
                    <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
                        tools4dev
                    </p>
                    <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                        <span className="bg-gradient-to-br from-surface-foreground via-surface-foreground to-surface-accent bg-clip-text text-transparent">
                            Ferramentas essenciais
                        </span>
                        <br className="hidden sm:block" />
                        <span className="text-surface-foreground">
                            {' '}
                            para desenvolvedores modernos
                        </span>
                    </h1>
                    <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        Geradores, formatadores, utilitários de segurança e
                        compressores reunidos em um painel elegante. Selecione
                        qualquer ferramenta na barra lateral para começar.
                    </p>
                    <div className="mt-7 flex flex-wrap justify-center gap-1.5">
                        {categories.map((category) => {
                            return (
                                <CategoryBadge
                                    key={category}
                                    category={category}
                                />
                            );
                        })}
                    </div>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <Link
                            href="/tools/json-formatter"
                            className="inline-flex h-10 items-center justify-center rounded-lg bg-surface-accent px-6 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:bg-surface-accent-hover"
                        >
                            Abrir uma ferramenta
                        </Link>
                        <a
                            href={repoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-10 items-center justify-center rounded-lg border border-surface-border/70 bg-surface-input px-6 text-sm font-semibold text-surface-foreground transition-all hover:border-surface-accent/50 hover:bg-surface-muted/60"
                        >
                            Dar uma estrela no GitHub
                        </a>
                    </div>
                    <div className="mt-8 grid grid-cols-3 gap-4 border-t border-surface-border/50 pt-6">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-surface-foreground">
                                {toolDefinitions.length}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                ferramentas
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-surface-foreground">
                                100%
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                no navegador
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-surface-foreground">
                                open
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                source
                            </p>
                        </div>
                    </div>
                    <div className="mt-8 border-t border-surface-border/50 pt-6 text-left">
                        <h2 className="text-lg font-semibold tracking-tight text-surface-foreground">
                            Ferramentas em Destaque
                        </h2>
                        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                            Utilitários gratuitos para o dia a dia do
                            desenvolvimento.
                        </p>
                        <ul className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                            {featuredTools.map((tool) => (
                                <li key={tool.slug}>
                                    <Link
                                        href={tool.path}
                                        className="group flex flex-col rounded-xl border border-surface-border/60 bg-surface-muted/20 p-3.5 transition-all hover:border-surface-accent/40 hover:bg-surface-muted/40"
                                    >
                                        <span className="text-sm font-semibold text-surface-foreground group-hover:text-surface-accent">
                                            {tool.name}
                                        </span>
                                        <p className="mt-1 line-clamp-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                            {tool.description}
                                        </p>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
        </>
    );
}
