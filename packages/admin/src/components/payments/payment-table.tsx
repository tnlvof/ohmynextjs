import React from 'react';

interface Payment {
  id: string;
  orderId: string;
  userId: string;
  userName: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded' | 'partial_refunded';
  method: 'card' | 'virtual_account' | 'transfer' | 'mobile';
  createdAt: string;
}

interface PaymentTableProps {
  payments: Payment[];
  total: number;
  page: number;
  onPageChange: (page: number) => void;
  onRefund: (paymentId: string) => void;
}

export function PaymentTable({ payments, total, page, onPageChange, onRefund }: PaymentTableProps) {
  if (payments.length === 0) {
    return <div>결제 내역이 없습니다</div>;
  }

  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>주문번호</th>
            <th>유저</th>
            <th>금액</th>
            <th>상태</th>
            <th>결제방법</th>
            <th>날짜</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.orderId}</td>
              <td>{payment.userName}</td>
              <td>₩{payment.amount.toLocaleString('ko-KR')}</td>
              <td>{payment.status}</td>
              <td>{payment.method}</td>
              <td>{payment.createdAt}</td>
              <td>
                {payment.status === 'paid' && (
                  <button onClick={() => onRefund(payment.id)}>환불</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        총 {total}건 | 페이지 {page}
        <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}>이전</button>
        <button onClick={() => onPageChange(page + 1)}>다음</button>
      </div>
    </div>
  );
}
