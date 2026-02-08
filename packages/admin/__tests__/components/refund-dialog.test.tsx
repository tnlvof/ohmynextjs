import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RefundDialog } from '../../src/components/payments/refund-dialog';

describe('RefundDialog', () => {
  it('should render when open', () => {
    render(<RefundDialog open={true} paymentId="pay-1" maxAmount={10000} onClose={() => {}} onConfirm={() => {}} />);
    expect(screen.getByText('환불 처리')).toBeInTheDocument();
  });

  it('should require reason', () => {
    const onConfirm = vi.fn();
    render(<RefundDialog open={true} paymentId="pay-1" maxAmount={10000} onClose={() => {}} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByText('환불'));
    expect(onConfirm).not.toHaveBeenCalled();
    expect(screen.getByText('환불 사유를 입력해주세요')).toBeInTheDocument();
  });

  it('should validate amount does not exceed max', () => {
    const onConfirm = vi.fn();
    render(<RefundDialog open={true} paymentId="pay-1" maxAmount={10000} onClose={() => {}} onConfirm={onConfirm} />);
    fireEvent.change(screen.getByLabelText('환불 금액'), { target: { value: '20000' } });
    fireEvent.change(screen.getByLabelText('환불 사유'), { target: { value: 'test' } });
    fireEvent.click(screen.getByText('환불'));
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
