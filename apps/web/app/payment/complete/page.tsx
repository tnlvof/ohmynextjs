'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { formatPrice } from '@ohmynextjs/payment';

function PaymentCompleteContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  const planName = searchParams.get('plan') || 'Pro';

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-3xl">
          ✅
        </div>
        <h1 className="text-2xl font-bold">결제 완료</h1>
        <p className="mt-2 text-muted-foreground">결제가 성공적으로 완료되었습니다.</p>
        <div className="mt-6 rounded-md bg-muted p-4 text-left text-sm">
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-muted-foreground">플랜</span>
            <span className="font-medium">{planName}</span>
          </div>
          {amount && (
            <div className="flex justify-between border-b border-border py-2">
              <span className="text-muted-foreground">금액</span>
              <span className="font-medium">{formatPrice(Number(amount))}</span>
            </div>
          )}
          {orderId && (
            <div className="flex justify-between pt-2">
              <span className="text-muted-foreground">주문번호</span>
              <span className="font-medium text-xs">{orderId}</span>
            </div>
          )}
        </div>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          대시보드로 이동
        </Link>
      </div>
    </div>
  );
}

export default function PaymentCompletePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">로딩 중...</div>}>
      <PaymentCompleteContent />
    </Suspense>
  );
}
