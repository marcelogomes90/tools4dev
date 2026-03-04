'use client';

import { Clipboard, ClipboardCheck } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
}

export function CopyButton({
  value,
  label = 'Copiar',
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onCopy}
      disabled={!value}
      className={className}
    >
      {copied ? (
        <ClipboardCheck className="mr-2 h-4 w-4" />
      ) : (
        <Clipboard className="mr-2 h-4 w-4" />
      )}
      {copied ? 'Copiado' : label}
    </Button>
  );
}
