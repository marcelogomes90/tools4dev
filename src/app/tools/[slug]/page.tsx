import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ToolRenderer } from '@/components/tools/tool-renderer';
import {
  getToolBySlug,
  getToolCategories,
  toolDefinitions,
} from '@/lib/tool-registry';
import {
  SITE_NAME,
  getPublicSiteUrl,
  getToolSeoDescription,
  getToolSeoKeywords,
  getToolSeoTitle,
} from '@/lib/seo';

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return toolDefinitions.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {
      title: `Ferramenta não encontrada | ${SITE_NAME}`,
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = getToolSeoTitle(tool);
  const description = getToolSeoDescription(tool);
  const canonicalPath = `/tools/${tool.slug}`;
  const siteUrl = getPublicSiteUrl();

  return {
    title,
    description,
    keywords: getToolSeoKeywords(tool),
    robots: {
      index: true,
      follow: true,
    },
    alternates: siteUrl
      ? {
          canonical: canonicalPath,
        }
      : undefined,
    openGraph: {
      title,
      description,
      ...(siteUrl ? { url: `${siteUrl}${canonicalPath}` } : {}),
      siteName: SITE_NAME,
      type: 'website',
      ...(siteUrl
        ? {
            images: [
              {
                url: `${siteUrl}/developer.png`,
                width: 1200,
                height: 630,
                alt: tool.name,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(siteUrl ? { images: [`${siteUrl}/developer.png`] } : {}),
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const siteUrl = getPublicSiteUrl();
  const canonicalPath = `/tools/${tool.slug}`;
  const toolCategories = getToolCategories(tool);
  const toolJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: getToolSeoDescription(tool),
    applicationCategory: toolCategories.join(', '),
    operatingSystem: 'Web',
    isAccessibleForFree: true,
    ...(siteUrl ? { url: `${siteUrl}${canonicalPath}` } : {}),
    keywords: getToolSeoKeywords(tool).join(', '),
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: SITE_NAME,
        ...(siteUrl ? { item: siteUrl } : {}),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: tool.name,
        ...(siteUrl ? { item: `${siteUrl}${canonicalPath}` } : {}),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ToolRenderer slug={slug} />
    </>
  );
}
