import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PaymentButton } from '../../src/components/payment-button';

describe('PaymentButton', () => {
  it('should render default text with amount', () => {
    render(<PaymentButton amount={10000} orderName="프로 요금제" mode="one-time" />);

    expect(screen.getByText('10,000원 결제하기')).toBeInTheDocument();
  });

  it('should render custom children', () => {
    render(
      <PaymentButton amount={10000} orderName="프로 요금제" mode="one-time">
        구매하기
      </PaymentButton>,
    );

    expect(screen.getByText('구매하기')).toBeInTheDocument();
  });

  it('should show loading state on click', async () => {
    const onPayment = vi.fn(() => new Promise<void>((resolve) => setTimeout(resolve, 100)));
    render(<PaymentButton amount={10000} orderName="프로" mode="one-time" onPayment={onPayment} />);

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByRole('status')).toHaveTextContent('처리 중...');
  });

  it('should call onPayment when clicked', async () => {
    const onPayment = vi.fn().mockResolvedValue(undefined);
    render(<PaymentButton amount={10000} orderName="프로" mode="one-time" onPayment={onPayment} />);

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(onPayment).toHaveBeenCalled();
    });
  });

  it('should be disabled while loading', async () => {
    const onPayment = vi.fn(() => new Promise<void>((resolve) => setTimeout(resolve, 100)));
    render(<PaymentButton amount={10000} orderName="프로" mode="one-time" onPayment={onPayment} />);

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByRole('button')).toBeDisabled();
  });
});
