import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cancelSubscription, setCancelSubscriptionDeps } from '../../src/actions/cancel-subscription';
import { PaymentError } from '../../src/types';

describe('cancelSubscription', () => {
  const mockGetCurrentUserId = vi.fn();
  const mockFindSubscriptionById = vi.fn();
  const mockUpdateSubscription = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    mockGetCurrentUserId.mockResolvedValue('user-123');
    mockUpdateSubscription.mockResolvedValue(undefined);
    setCancelSubscriptionDeps({
      getCurrentUserId: mockGetCurrentUserId,
      findSubscriptionById: mockFindSubscriptionById,
      updateSubscription: mockUpdateSubscription,
    });
  });

  it('should cancel at period end by default', async () => {
    mockFindSubscriptionById.mockResolvedValue({
      id: 'sub-1',
      status: 'active',
      cancelAtPeriodEnd: false,
    });

    const result = await cancelSubscription({ subscriptionId: 'sub-1' });

    expect(result.success).toBe(true);
    expect(mockUpdateSubscription).toHaveBeenCalledWith('sub-1', expect.objectContaining({
      cancelAtPeriodEnd: true,
    }));
  });

  it('should cancel immediately when immediate=true', async () => {
    mockFindSubscriptionById.mockResolvedValue({
      id: 'sub-1',
      status: 'active',
      cancelAtPeriodEnd: false,
    });

    await cancelSubscription({ subscriptionId: 'sub-1', immediate: true });

    expect(mockUpdateSubscription).toHaveBeenCalledWith('sub-1', expect.objectContaining({
      status: 'cancelled',
      cancelAtPeriodEnd: false,
    }));
  });

  it('should throw when subscription not found', async () => {
    mockFindSubscriptionById.mockResolvedValue(null);

    await expect(
      cancelSubscription({ subscriptionId: 'sub-invalid' }),
    ).rejects.toThrow('구독 정보를 찾을 수 없습니다');
  });

  it('should throw when subscription already cancelled', async () => {
    mockFindSubscriptionById.mockResolvedValue({
      id: 'sub-1',
      status: 'cancelled',
    });

    await expect(
      cancelSubscription({ subscriptionId: 'sub-1' }),
    ).rejects.toThrow('이미 취소된 구독입니다');
  });

  it('should throw UNAUTHORIZED when not authenticated', async () => {
    mockGetCurrentUserId.mockResolvedValue('');

    await expect(
      cancelSubscription({ subscriptionId: 'sub-1' }),
    ).rejects.toThrow('인증이 필요합니다');
  });
});
