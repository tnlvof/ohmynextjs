import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PaymentHistory } from '../../src/components/payment-history';
import type { Payment } from '../../src/types';

const mockPayments: Payment[] = [
  {
    id: '1', userId: 'u1', planId: null, orderId: 'OMN_001', paymentKey: 'pk_1',
    amount: 10000, currency: 'KRW', status: 'paid', method: 'card',
    receiptUrl: null, failReason: null, cancelReason: null, cancelAmount: null,
    paidAt: new Date('2026-01-15'), cancelledAt: null, metadata: null,
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: '2', userId: 'u1', planId: null, orderId: 'OMN_002', paymentKey: 'pk_2',
    amount: 5000, currency: 'KRW', status: 'refunded', method: 'card',
    receiptUrl: null, failReason: null, cancelReason: '고객 요청', cancelAmount: 5000,
    paidAt: new Date('2026-01-10'), cancelledAt: new Date('2026-01-12'), metadata: null,
    createdAt: new Date(), updatedAt: new Date(),
  },
];

describe('PaymentHistory', () => {
  it('should render payment list', () => {
    render(<PaymentHistory payments={mockPayments} />);

    expect(screen.getByText('OMN_001')).toBeInTheDocument();
    expect(screen.getByText('OMN_002')).toBeInTheDocument();
  });

  it('should display status badges', () => {
    render(<PaymentHistory payments={mockPayments} />);

    expect(screen.getByText('결제완료')).toBeInTheDocument();
    expect(screen.getByText('환불됨')).toBeInTheDocument();
  });

  it('should display amounts', () => {
    render(<PaymentHistory payments={mockPayments} />);

    expect(screen.getByText('₩10,000')).toBeInTheDocument();
    expect(screen.getByText('₩5,000')).toBeInTheDocument();
  });

  it('should show empty state when no payments', () => {
    render(<PaymentHistory payments={[]} />);

    expect(screen.getByText('결제 내역이 없습니다')).toBeInTheDocument();
  });

  it('should render as a table', () => {
    render(<PaymentHistory payments={mockPayments} />);

    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});
