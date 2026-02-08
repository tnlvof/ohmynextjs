import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PaymentTable } from '../../src/components/payments/payment-table';

describe('PaymentTable', () => {
  const mockPayments = [
    { id: '1', orderId: 'ORD-001', userId: 'u1', userName: 'User 1', amount: 10000, status: 'paid' as const, method: 'card' as const, createdAt: '2024-01-01' },
    { id: '2', orderId: 'ORD-002', userId: 'u2', userName: 'User 2', amount: 20000, status: 'refunded' as const, method: 'transfer' as const, createdAt: '2024-01-02' },
  ];

  it('should render payment list', () => {
    render(<PaymentTable payments={mockPayments} total={2} page={1} onPageChange={() => {}} onRefund={() => {}} />);
    expect(screen.getByText('ORD-001')).toBeInTheDocument();
    expect(screen.getByText('ORD-002')).toBeInTheDocument();
  });

  it('should show empty state', () => {
    render(<PaymentTable payments={[]} total={0} page={1} onPageChange={() => {}} onRefund={() => {}} />);
    expect(screen.getByText('결제 내역이 없습니다')).toBeInTheDocument();
  });
});
