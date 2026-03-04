import { notFound } from 'next/navigation';
import { ToolRenderer } from '@/components/tools/tool-renderer';
import { getToolBySlug } from '@/lib/tool-registry';

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  return <ToolRenderer slug={slug} />;
}
