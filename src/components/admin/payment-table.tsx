'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { PaymentStatusBadge } from './payment-status-badge';
import type { PaymentWithUser } from '@/lib/admin/queries';

const statuses = [
  { value: '', label: '전체' },
  { value: 'pending', label: '대기' },
  { value: 'paid', label: '완료' },
  { value: 'failed', label: '실패' },
  { value: 'cancelled', label: '취소' },
  { value: 'refunded', label: '환불' },
];

interface PaymentTableProps {
  payments: PaymentWithUser[];
  currentStatus: string;
}

export function PaymentTable({ payments, currentStatus }: PaymentTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleStatusFilter = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  const formatAmount = (amount: number) => `\u20A9${amount.toLocaleString()}`;

  return (
    <div>
      {/* Status filter tabs */}
      <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="결제 상태 필터">
        {statuses.map((s) => (
          <button
            key={s.value}
            onClick={() => handleStatusFilter(s.value)}
            role="tab"
            aria-selected={currentStatus === s.value}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              currentStatus === s.value
                ? 'bg-primary text-primary-foreground'
                : 'border border-border hover:bg-accent'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm" role="table">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">주문ID</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">유저</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">금액</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">상태</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">결제수단</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">결제일</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-b border-border hover:bg-accent/50">
                <td className="px-4 py-3 font-mono text-xs">{p.orderId}</td>
                <td className="px-4 py-3">{p.user?.email ?? '-'}</td>
                <td className="px-4 py-3 text-right">{formatAmount(p.amount)}</td>
                <td className="px-4 py-3"><PaymentStatusBadge status={p.status} /></td>
                <td className="px-4 py-3">{p.method ?? '-'}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {p.paidAt ? new Date(p.paidAt).toLocaleDateString('ko-KR') : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {payments.map((p) => (
          <div key={p.id} className="rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs">{p.orderId}</span>
              <PaymentStatusBadge status={p.status} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{p.user?.email ?? '-'}</p>
            <p className="mt-1 text-lg font-bold">{formatAmount(p.amount)}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {p.paidAt ? new Date(p.paidAt).toLocaleDateString('ko-KR') : '-'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
