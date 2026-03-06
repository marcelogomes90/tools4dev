import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ToolRenderer } from '@/components/tools/tool-renderer';
import { getToolBySlug, getToolCategories } from '@/lib/tool-registry';
import {
  SITE_NAME,
  getSiteUrl,
  getToolSeoDescription,
  getToolSeoKeywords,
  getToolSeoTitle,
} from '@/lib/seo';

interface ToolPageProps {
  params: Promise<{ slug: string }>;
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
  const siteUrl = getSiteUrl();

  return {
    title,
    description,
    keywords: getToolSeoKeywords(tool),
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}${canonicalPath}`,
      siteName: SITE_NAME,
      type: 'website',
      images: [
        {
          url: '/developer.png',
          width: 1200,
          height: 630,
          alt: tool.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/developer.png'],
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const siteUrl = getSiteUrl();
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
    url: `${siteUrl}${canonicalPath}`,
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
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: tool.name,
        item: `${siteUrl}${canonicalPath}`,
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
