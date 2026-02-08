import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createSubscription, setCreateSubscriptionDeps } from '../../src/actions/create-subscription';
import { PaymentError } from '../../src/types';

describe('createSubscription', () => {
  const mockGetCurrentUserId = vi.fn();
  const mockFindPlanById = vi.fn();
  const mockIssueBillingKey = vi.fn();
  const mockPayWithBillingKey = vi.fn();
  const mockInsertSubscription = vi.fn();
  const mockInsertPayment = vi.fn();

  const mockPlan = {
    id: 'plan-1',
    name: '프로',
    slug: 'pro',
    price: 9900,
    currency: 'KRW',
    interval: 'month',
    intervalCount: 1,
  };

  beforeEach(() => {
    vi.resetAllMocks();
    mockGetCurrentUserId.mockResolvedValue('user-123');
    mockFindPlanById.mockResolvedValue(mockPlan);
    mockIssueBillingKey.mockResolvedValue({ billingKey: 'bk_123', customerKey: 'user-123' });
    mockPayWithBillingKey.mockResolvedValue({
      paymentKey: 'pk_789',
      approvedAt: '2026-01-01T00:00:00Z',
    });
    mockInsertSubscription.mockResolvedValue({
      id: 'sub-1',
      userId: 'user-123',
      planId: 'plan-1',
      status: 'active',
      billingKey: 'bk_123',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(),
      cancelAtPeriodEnd: false,
      cancelledAt: null,
    });
    mockInsertPayment.mockResolvedValue(undefined);

    setCreateSubscriptionDeps({
      getCurrentUserId: mockGetCurrentUserId,
      findPlanById: mockFindPlanById,
      issueBillingKey: mockIssueBillingKey,
      payWithBillingKey: mockPayWithBillingKey,
      insertSubscription: mockInsertSubscription,
      insertPayment: mockInsertPayment,
    });
  });

  it('should issue billing key and create subscription', async () => {
    const result = await createSubscription({
      planId: 'plan-1',
      customerKey: 'user-123',
      authKey: 'auth_abc',
    });

    expect(mockIssueBillingKey).toHaveBeenCalledWith({
      customerKey: 'user-123',
      authKey: 'auth_abc',
    });
    expect(result.subscription.status).toBe('active');
  });

  it('should execute first payment with billing key', async () => {
    await createSubscription({
      planId: 'plan-1',
      customerKey: 'user-123',
      authKey: 'auth_abc',
    });

    expect(mockPayWithBillingKey).toHaveBeenCalledWith('bk_123', expect.objectContaining({
      customerKey: 'user-123',
      amount: 9900,
      orderName: '프로 구독',
    }));
  });

  it('should create payment record', async () => {
    await createSubscription({
      planId: 'plan-1',
      customerKey: 'user-123',
      authKey: 'auth_abc',
    });

    expect(mockInsertPayment).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'user-123',
      planId: 'plan-1',
      amount: 9900,
      paymentKey: 'pk_789',
      status: 'paid',
    }));
  });

  it('should throw BILLING_KEY_FAILED when billing key issuance fails', async () => {
    mockIssueBillingKey.mockRejectedValue(new Error('card error'));

    await expect(
      createSubscription({ planId: 'plan-1', customerKey: 'user-123', authKey: 'auth_bad' }),
    ).rejects.toThrow('카드 등록에 실패했습니다');
  });

  it('should throw when plan not found', async () => {
    mockFindPlanById.mockResolvedValue(null);

    await expect(
      createSubscription({ planId: 'plan-invalid', customerKey: 'user-123', authKey: 'auth_abc' }),
    ).rejects.toThrow('요금제를 찾을 수 없습니다');
  });
});
