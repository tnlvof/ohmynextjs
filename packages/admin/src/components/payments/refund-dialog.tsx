import React, { useState } from 'react';

interface RefundDialogProps {
  open: boolean;
  paymentId: string;
  maxAmount: number;
  onClose: () => void;
  onConfirm: (paymentId: string, amount: number | undefined, reason: string) => void;
}

export function RefundDialog({ open, paymentId, maxAmount, onClose, onConfirm }: RefundDialogProps) {
  const [amount, setAmount] = useState<string>('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = () => {
    setError(null);

    if (!reason.trim()) {
      setError('환불 사유를 입력해주세요');
      return;
    }

    const numAmount = amount ? Number(amount) : undefined;
    if (numAmount !== undefined && numAmount > maxAmount) {
      setError(`환불 금액은 ${maxAmount.toLocaleString('ko-KR')}원을 초과할 수 없습니다`);
      return;
    }

    if (numAmount !== undefined && numAmount <= 0) {
      setError('환불 금액은 0보다 커야 합니다');
      return;
    }

    onConfirm(paymentId, numAmount, reason);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', padding: '24px', borderRadius: '8px', minWidth: '400px' }}>
        <h2>환불 처리</h2>
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="refund-amount">환불 금액</label>
          <input
            id="refund-amount"
            aria-label="환불 금액"
            type="number"
            placeholder={`최대 ${maxAmount.toLocaleString('ko-KR')}원 (미입력시 전액)`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ display: 'block', width: '100%', marginTop: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="refund-reason">환불 사유</label>
          <textarea
            id="refund-reason"
            aria-label="환불 사유"
            placeholder="환불 사유를 입력해주세요"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{ display: 'block', width: '100%', marginTop: '4px' }}
          />
        </div>
        {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button onClick={onClose}>취소</button>
          <button onClick={handleSubmit}>환불</button>
        </div>
      </div>
    </div>
  );
}
