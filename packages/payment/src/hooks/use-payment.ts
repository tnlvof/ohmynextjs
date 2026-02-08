'use client';

import { useState, useCallback } from 'react';
import type { CreateOrderResult } from '../types';

interface UsePaymentOptions {
  onSuccess?: (result: CreateOrderResult) => void;
  onError?: (error: Error) => void;
}

export function usePayment(options: UsePaymentOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const startPayment = useCallback(async (
    createOrderFn: () => Promise<CreateOrderResult>,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createOrderFn();
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [options]);

  return { startPayment, loading, error };
}
