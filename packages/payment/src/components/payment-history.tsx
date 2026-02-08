'use client';

import React from 'react';
import type { Payment } from '../types';
import { formatPrice } from '../lib/price-format';

export interface PaymentHistoryProps {
  payments: Payment[];
}

const statusLabels: Record<string, { text: string; className: string }> = {
  paid: { text: '결제완료', className: 'bg-green-100 text-green-800' },
  refunded: { text: '환불됨', className: 'bg-red-100 text-red-800' },
  partial_refunded: { text: '부분환불', className: 'bg-orange-100 text-orange-800' },
  pending: { text: '대기중', className: 'bg-yellow-100 text-yellow-800' },
  failed: { text: '실패', className: 'bg-red-100 text-red-800' },
  cancelled: { text: '취소됨', className: 'bg-gray-100 text-gray-800' },
};

export function PaymentHistory({ payments }: PaymentHistoryProps) {
  if (payments.length === 0) {
    return <p className="text-center text-gray-500 py-8">결제 내역이 없습니다</p>;
  }

  return (
    <table className="w-full" role="table">
      <thead>
        <tr>
          <th className="text-left p-2">주문명</th>
          <th className="text-left p-2">금액</th>
          <th className="text-left p-2">상태</th>
          <th className="text-left p-2">결제일</th>
        </tr>
      </thead>
      <tbody>
        {payments.map((payment) => {
          const status = statusLabels[payment.status] ?? { text: payment.status, className: 'bg-gray-100' };
          return (
            <tr key={payment.id}>
              <td className="p-2">{payment.orderId}</td>
              <td className="p-2">{formatPrice(payment.amount)}</td>
              <td className="p-2">
                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}>
                  {status.text}
                </span>
              </td>
              <td className="p-2">
                {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString('ko-KR') : '-'}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
