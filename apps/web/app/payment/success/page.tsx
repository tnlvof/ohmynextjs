'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { formatPrice } from '@ohmynextjs/payment';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const paymentKey = searchParams.get('paymentKey');
  const amount = searchParams.get('amount');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!orderId || !paymentKey || !amount) {
      setStatus('error');
      setErrorMessage('결제 정보가 올바르지 않습니다.');
      return;
    }

    // In production: call confirmPayment server action
    const timer = setTimeout(() => {
      setStatus('success');
    }, 1500);

    return () => clearTimeout(timer);
  }, [orderId, paymentKey, amount]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-lg border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
          </div>
          <h1 className="text-2xl font-bold">결제 처리 중...</h1>
          <p className="mt-2 text-muted-foreground">결제를 확인하고 있습니다. 잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-lg border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 text-4xl">❌</div>
          <h1 className="text-2xl font-bold text-destructive">결제 확인 실패</h1>
          <p className="mt-2 text-muted-foreground">{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 text-4xl">✅</div>
        <h1 className="text-2xl font-bold">결제 완료</h1>
        <p className="mt-2 text-muted-foreground">결제가 성공적으로 완료되었습니다.</p>
        {amount && (
          <p className="mt-4 text-xl font-semibold">{formatPrice(Number(amount))}</p>
        )}
        {orderId && (
          <p className="mt-1 text-sm text-muted-foreground">주문번호: {orderId}</p>
        )}
        <a
          href="/dashboard"
          className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          대시보드로 이동
        </a>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">로딩 중...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
