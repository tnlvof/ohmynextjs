import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TossClient, TossPaymentError } from './toss';

describe('TossClient', () => {
  let client: TossClient;

  beforeEach(() => {
    client = new TossClient('test_sk_123');
  });

  it('creates instance', () => {
    expect(client).toBeInstanceOf(TossClient);
  });

  it('confirms payment', async () => {
    const mockPayment = {
      paymentKey: 'pk_123',
      orderId: 'order_123',
      orderName: 'Test',
      status: 'DONE',
      totalAmount: 10000,
      method: '카드',
      receipt: null,
      approvedAt: '2025-01-01T00:00:00Z',
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockPayment,
    } as Response);

    const result = await client.confirmPayment({
      paymentKey: 'pk_123',
      orderId: 'order_123',
      amount: 10000,
    });

    expect(result.paymentKey).toBe('pk_123');
    expect(result.totalAmount).toBe(10000);
  });

  it('throws TossPaymentError on failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      json: async () => ({ code: 'INVALID_AMOUNT', message: '금액이 올바르지 않습니다' }),
    } as Response);

    await expect(
      client.confirmPayment({ paymentKey: 'pk', orderId: 'o', amount: -1 })
    ).rejects.toThrow(TossPaymentError);
  });
});

describe('TossPaymentError', () => {
  it('has code and message', () => {
    const err = new TossPaymentError('TEST_CODE', 'test message');
    expect(err.code).toBe('TEST_CODE');
    expect(err.message).toBe('test message');
    expect(err.name).toBe('TossPaymentError');
  });
});
