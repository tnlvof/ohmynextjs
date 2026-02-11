'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
}

export function Pagination({ currentPage, totalPages, total }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    return `${pathname}?${params.toString()}`;
  };

  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-between py-4" role="navigation" aria-label="페이지네이션">
      <p className="text-sm text-muted-foreground">총 {total.toLocaleString()}건</p>
      <div className="flex items-center gap-1">
        {currentPage > 1 && (
          <Link href={createUrl(currentPage - 1)} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-accent" aria-label="이전 페이지">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        )}
        {pages.map((p) => (
          <Link
            key={p}
            href={createUrl(p)}
            className={clsx(
              'inline-flex h-8 w-8 items-center justify-center rounded-md text-sm',
              p === currentPage ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-accent'
            )}
            aria-current={p === currentPage ? 'page' : undefined}
          >
            {p}
          </Link>
        ))}
        {currentPage < totalPages && (
          <Link href={createUrl(currentPage + 1)} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-accent" aria-label="다음 페이지">
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
