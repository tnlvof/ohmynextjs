import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createOrder, setCreateOrderDeps } from '../../src/actions/create-order';
import { PaymentError } from '../../src/types';

describe('createOrder', () => {
  const mockInsertPayment = vi.fn();
  const mockGetCurrentUserId = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    mockGetCurrentUserId.mockResolvedValue('user-123');
    mockInsertPayment.mockResolvedValue(undefined);
    setCreateOrderDeps({
      getCurrentUserId: mockGetCurrentUserId,
      insertPayment: mockInsertPayment,
    });
  });

  it('should create an order and return orderId', async () => {
    const result = await createOrder({ amount: 10000, orderName: '프로 요금제' });

    expect(result.orderId).toMatch(/^OMN_\d+_[A-Z0-9]+$/);
    expect(result.amount).toBe(10000);
    expect(result.orderName).toBe('프로 요금제');
  });

  it('should save payment to DB', async () => {
    await createOrder({ amount: 10000, orderName: '프로 요금제', planId: 'plan-1' });

    expect(mockInsertPayment).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-123',
        planId: 'plan-1',
        amount: 10000,
        orderName: '프로 요금제',
      }),
    );
  });

  it('should throw UNAUTHORIZED when not authenticated', async () => {
    mockGetCurrentUserId.mockResolvedValue('');

    await expect(createOrder({ amount: 10000, orderName: 'test' })).rejects.toThrow(PaymentError);
    await expect(createOrder({ amount: 10000, orderName: 'test' })).rejects.toThrow('인증이 필요합니다');
  });

  it('should generate unique orderIds', async () => {
    const result1 = await createOrder({ amount: 10000, orderName: 'a' });
    const result2 = await createOrder({ amount: 20000, orderName: 'b' });

    expect(result1.orderId).not.toBe(result2.orderId);
  });

  it('should throw on invalid amount', async () => {
    await expect(createOrder({ amount: 0, orderName: 'test' })).rejects.toThrow(PaymentError);
    await expect(createOrder({ amount: -100, orderName: 'test' })).rejects.toThrow('결제 금액이 올바르지 않습니다');
  });
});
