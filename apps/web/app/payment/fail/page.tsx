'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function PaymentFailContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const message = searchParams.get('message');
  const orderId = searchParams.get('orderId');

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-3xl">
          ❌
        </div>
        <h1 className="text-2xl font-bold text-destructive">결제 실패</h1>
        <p className="mt-2 text-muted-foreground">
          {message || '결제 처리 중 오류가 발생했습니다.'}
        </p>
        {code && (
          <p className="mt-1 text-xs text-muted-foreground">오류 코드: {code}</p>
        )}
        {orderId && (
          <p className="mt-1 text-xs text-muted-foreground">주문번호: {orderId}</p>
        )}
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/billing"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            다시 시도하기
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent"
          >
            대시보드로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">로딩 중...</div>}>
      <PaymentFailContent />
    </Suspense>
  );
}
