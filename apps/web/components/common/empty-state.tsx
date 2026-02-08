import Link from 'next/link';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  message: string;
  icon?: ReactNode;
  ctaLabel?: string;
  ctaHref?: string;
}

export function EmptyState({ message, icon, ctaLabel, ctaHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className="mb-4">{icon}</div>}
      <p className="text-muted-foreground">{message}</p>
      {ctaLabel && ctaHref && (
        <Link href={ctaHref} className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
