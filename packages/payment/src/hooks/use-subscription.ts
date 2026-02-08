'use client';

import { useState, useCallback } from 'react';
import type { Subscription } from '../types';

interface UseSubscriptionOptions {
  onCancel?: () => void;
  onError?: (error: Error) => void;
}

export function useSubscription(
  subscription: Subscription | null,
  options: UseSubscriptionOptions = {},
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const cancel = useCallback(async (
    cancelFn: () => Promise<void>,
  ) => {
    setLoading(true);
    setError(null);
    try {
      await cancelFn();
      options.onCancel?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [options]);

  const isActive = subscription?.status === 'active';
  const isCancelling = subscription?.cancelAtPeriodEnd ?? false;

  return { cancel, loading, error, isActive, isCancelling };
}
