import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cancelPayment, setCancelPaymentDeps } from '../../src/actions/cancel-payment';
import { PaymentError } from '../../src/types';

describe('cancelPayment', () => {
  const mockGetCurrentUserId = vi.fn();
  const mockFindPaymentByPaymentKey = vi.fn();
  const mockUpdatePayment = vi.fn();
  const mockCancelPayment = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    mockGetCurrentUserId.mockResolvedValue('user-123');
    mockUpdatePayment.mockResolvedValue(undefined);
    setCancelPaymentDeps({
      getCurrentUserId: mockGetCurrentUserId,
      findPaymentByPaymentKey: mockFindPaymentByPaymentKey,
      updatePayment: mockUpdatePayment,
      cancelPayment: mockCancelPayment,
    });
  });

  it('should process full refund', async () => {
    mockFindPaymentByPaymentKey.mockResolvedValue({
      paymentKey: 'pk_123',
      orderId: 'OMN_123',
      amount: 10000,
      status: 'paid',
    });
    mockCancelPayment.mockResolvedValue({ paymentKey: 'pk_123', status: 'CANCELED' });

    const result = await cancelPayment({ paymentKey: 'pk_123', cancelReason: '고객 요청' });

    expect(result.success).toBe(true);
    expect(mockUpdatePayment).toHaveBeenCalledWith('OMN_123', expect.objectContaining({
      status: 'refunded',
      cancelReason: '고객 요청',
      cancelAmount: 10000,
    }));
  });

  it('should process partial refund', async () => {
    mockFindPaymentByPaymentKey.mockResolvedValue({
      paymentKey: 'pk_123',
      orderId: 'OMN_123',
      amount: 10000,
      status: 'paid',
    });
    mockCancelPayment.mockResolvedValue({ paymentKey: 'pk_123', status: 'PARTIAL_CANCELED' });

    await cancelPayment({ paymentKey: 'pk_123', cancelReason: '부분 환불', cancelAmount: 5000 });

    expect(mockUpdatePayment).toHaveBeenCalledWith('OMN_123', expect.objectContaining({
      status: 'partial_refunded',
      cancelAmount: 5000,
    }));
  });

  it('should throw when payment already refunded', async () => {
    mockFindPaymentByPaymentKey.mockResolvedValue({
      paymentKey: 'pk_123',
      orderId: 'OMN_123',
      amount: 10000,
      status: 'refunded',
    });

    await expect(
      cancelPayment({ paymentKey: 'pk_123', cancelReason: '다시 환불' }),
    ).rejects.toThrow('이미 환불된 결제입니다');
  });

  it('should throw when payment not found', async () => {
    mockFindPaymentByPaymentKey.mockResolvedValue(null);

    await expect(
      cancelPayment({ paymentKey: 'pk_invalid', cancelReason: '환불' }),
    ).rejects.toThrow('결제 정보를 찾을 수 없습니다');
  });

  it('should propagate Toss API errors', async () => {
    mockFindPaymentByPaymentKey.mockResolvedValue({
      paymentKey: 'pk_123',
      orderId: 'OMN_123',
      amount: 10000,
      status: 'paid',
    });
    mockCancelPayment.mockRejectedValue(new Error('Toss API error'));

    await expect(
      cancelPayment({ paymentKey: 'pk_123', cancelReason: '환불' }),
    ).rejects.toThrow('Toss API error');
  });
});
