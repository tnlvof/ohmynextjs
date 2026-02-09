'use client';

import { useState } from 'react';
import { PaymentTable, RefundDialog } from '@ohmynextjs/admin/src/components/payments';

// Mock data - in production, fetch from API
const mockPayments = [
  { id: 'p1', orderId: 'OMN_20260209001', userId: 'u1', userName: '김민수', amount: 29000, status: 'paid' as const, method: 'card' as const, createdAt: '2026-02-09' },
  { id: 'p2', orderId: 'OMN_20260208001', userId: 'u2', userName: '이지영', amount: 9000, status: 'paid' as const, method: 'card' as const, createdAt: '2026-02-08' },
  { id: 'p3', orderId: 'OMN_20260207001', userId: 'u3', userName: '박준혁', amount: 29000, status: 'pending' as const, method: 'transfer' as const, createdAt: '2026-02-07' },
  { id: 'p4', orderId: 'OMN_20260206001', userId: 'u4', userName: '최서연', amount: 99000, status: 'refunded' as const, method: 'card' as const, createdAt: '2026-02-06' },
  { id: 'p5', orderId: 'OMN_20260205001', userId: 'u5', userName: '정하늘', amount: 29000, status: 'failed' as const, method: 'mobile' as const, createdAt: '2026-02-05' },
];

export default function AdminPaymentsPage() {
  const [page, setPage] = useState(1);
  const [refundTarget, setRefundTarget] = useState<string | null>(null);

  const refundPayment = mockPayments.find((p) => p.id === refundTarget);

  const handleRefundConfirm = (paymentId: string, amount: number | undefined, reason: string) => {
    // In production: call refund server action
    console.log('Refund:', { paymentId, amount, reason });
    setRefundTarget(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">결제 관리</h1>
        <p className="text-muted-foreground">결제 내역을 조회하고 환불을 처리합니다.</p>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <PaymentTable
          payments={mockPayments}
          total={mockPayments.length}
          page={page}
          onPageChange={setPage}
          onRefund={setRefundTarget}
        />
      </div>

      {refundTarget && refundPayment && (
        <RefundDialog
          open={!!refundTarget}
          paymentId={refundTarget}
          maxAmount={refundPayment.amount}
          onClose={() => setRefundTarget(null)}
          onConfirm={handleRefundConfirm}
        />
      )}
    </div>
  );
}
