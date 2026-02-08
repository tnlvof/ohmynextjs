'use client';

import React, { useState } from 'react';

export interface PaymentButtonProps {
  amount: number;
  orderName: string;
  planId?: string;
  mode: 'one-time' | 'subscription';
  onPayment?: (orderId: string) => Promise<void>;
  children?: React.ReactNode;
}

export function PaymentButton({ amount, orderName, mode, onPayment, children }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      if (onPayment) {
        await onPayment(`OMN_${Date.now()}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="rounded-md bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
      aria-label={`${orderName} ${mode === 'subscription' ? '구독' : '결제'}하기`}
    >
      {loading ? (
        <span role="status">처리 중...</span>
      ) : (
        children ?? `${amount.toLocaleString()}원 결제하기`
      )}
    </button>
  );
}
