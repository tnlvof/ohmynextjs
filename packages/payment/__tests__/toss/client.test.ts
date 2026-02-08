import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TossClient } from '../../src/toss/client';
import { TossPaymentError } from '../../src/toss/types';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('TossClient', () => {
  let client: TossClient;

  beforeEach(() => {
    client = new TossClient('test_sk_secret');
    mockFetch.mockReset();
  });

  it('should send correct authorization header', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ paymentKey: 'pk_123' }),
    });

    await client.confirmPayment({ paymentKey: 'pk_123', orderId: 'OMN_123', amount: 10000 });

    const [, options] = mockFetch.mock.calls[0];
    const expectedAuth = `Basic ${Buffer.from('test_sk_secret:').toString('base64')}`;
    expect(options.headers.Authorization).toBe(expectedAuth);
    expect(options.headers['Content-Type']).toBe('application/json');
  });

  it('should call confirm payment API', async () => {
    const mockPayment = { paymentKey: 'pk_123', orderId: 'OMN_123', totalAmount: 10000, status: 'DONE' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPayment,
    });

    const result = await client.confirmPayment({ paymentKey: 'pk_123', orderId: 'OMN_123', amount: 10000 });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.tosspayments.com/v1/payments/confirm',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(result.paymentKey).toBe('pk_123');
  });

  it('should call cancel payment API', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ paymentKey: 'pk_123', status: 'CANCELED' }),
    });

    await client.cancelPayment('pk_123', { cancelReason: '고객 요청' });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.tosspayments.com/v1/payments/pk_123/cancel',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('should throw TossPaymentError on API error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ code: 'ALREADY_PROCESSED_PAYMENT', message: '이미 처리된 결제입니다' }),
    });

    await expect(
      client.confirmPayment({ paymentKey: 'pk_123', orderId: 'OMN_123', amount: 10000 }),
    ).rejects.toThrow(TossPaymentError);
  });

  it('should parse error code and message', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ code: 'INVALID_REQUEST', message: '잘못된 요청입니다' }),
    });

    try {
      await client.confirmPayment({ paymentKey: 'pk_123', orderId: 'OMN_123', amount: 10000 });
    } catch (err) {
      expect(err).toBeInstanceOf(TossPaymentError);
      expect((err as TossPaymentError).code).toBe('INVALID_REQUEST');
      expect((err as TossPaymentError).message).toBe('잘못된 요청입니다');
    }
  });

  it('should issue billing key', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ billingKey: 'bk_123', customerKey: 'user1' }),
    });

    const result = await client.issueBillingKey({ customerKey: 'user1', authKey: 'auth_123' });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.tosspayments.com/v1/billing/authorizations/issue',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(result.billingKey).toBe('bk_123');
  });

  it('should pay with billing key', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ paymentKey: 'pk_456', status: 'DONE' }),
    });

    await client.payWithBillingKey('bk_123', {
      customerKey: 'user1',
      amount: 9900,
      orderId: 'OMN_456',
      orderName: '프로 구독',
    });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.tosspayments.com/v1/billing/bk_123',
      expect.objectContaining({ method: 'POST' }),
    );
  });
});
