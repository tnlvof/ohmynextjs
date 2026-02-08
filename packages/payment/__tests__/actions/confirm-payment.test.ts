import { describe, it, expect, vi, beforeEach } from 'vitest';
import { confirmPayment, setConfirmPaymentDeps } from '../../src/actions/confirm-payment';
import { PaymentError } from '../../src/types';

describe('confirmPayment', () => {
  const mockGetCurrentUserId = vi.fn();
  const mockFindPaymentByOrderId = vi.fn();
  const mockUpdatePayment = vi.fn();
  const mockConfirmPayment = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    mockGetCurrentUserId.mockResolvedValue('user-123');
    mockUpdatePayment.mockResolvedValue(undefined);
    setConfirmPaymentDeps({
      getCurrentUserId: mockGetCurrentUserId,
      findPaymentByOrderId: mockFindPaymentByOrderId,
      updatePayment: mockUpdatePayment,
      confirmPayment: mockConfirmPayment,
    });
  });

  it('should confirm payment and update DB', async () => {
    mockFindPaymentByOrderId.mockResolvedValue({
      orderId: 'OMN_123',
      amount: 10000,
      status: 'pending',
    });
    mockConfirmPayment.mockResolvedValue({
      paymentKey: 'pk_123',
      method: 'card',
      receipt: { url: 'https://receipt.url' },
      approvedAt: '2026-01-01T00:00:00Z',
    });

    const result = await confirmPayment({ orderId: 'OMN_123', paymentKey: 'pk_123', amount: 10000 });

    expect(result.success).toBe(true);
    expect(mockUpdatePayment).toHaveBeenCalledWith('OMN_123', expect.objectContaining({
      status: 'paid',
      paymentKey: 'pk_123',
    }));
  });

  it('should throw PAYMENT_AMOUNT_MISMATCH on amount mismatch', async () => {
    mockFindPaymentByOrderId.mockResolvedValue({
      orderId: 'OMN_123',
      amount: 10000,
      status: 'pending',
    });

    await expect(
      confirmPayment({ orderId: 'OMN_123', paymentKey: 'pk_123', amount: 9999 }),
    ).rejects.toThrow('결제 금액이 일치하지 않습니다');
  });

  it('should throw PAYMENT_NOT_FOUND when order does not exist', async () => {
    mockFindPaymentByOrderId.mockResolvedValue(null);

    await expect(
      confirmPayment({ orderId: 'OMN_INVALID', paymentKey: 'pk_123', amount: 10000 }),
    ).rejects.toThrow('결제 정보를 찾을 수 없습니다');
  });

  it('should throw PAYMENT_ALREADY_APPROVED when already paid', async () => {
    mockFindPaymentByOrderId.mockResolvedValue({
      orderId: 'OMN_123',
      amount: 10000,
      status: 'paid',
    });

    await expect(
      confirmPayment({ orderId: 'OMN_123', paymentKey: 'pk_123', amount: 10000 }),
    ).rejects.toThrow('이미 처리된 결제입니다');
  });

  it('should throw UNAUTHORIZED when not authenticated', async () => {
    mockGetCurrentUserId.mockResolvedValue('');

    await expect(
      confirmPayment({ orderId: 'OMN_123', paymentKey: 'pk_123', amount: 10000 }),
    ).rejects.toThrow('인증이 필요합니다');
  });
});
