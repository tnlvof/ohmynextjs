'use client';

import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={className ?? 'prose prose-neutral dark:prose-invert max-w-none'}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
