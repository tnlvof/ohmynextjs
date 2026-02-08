'use client';

import { useState, useEffect, useCallback } from 'react';

interface Setting {
  id: string;
  key: string;
  value: unknown;
  description: string | null;
  isPublic: boolean;
}

export function useAdminSettings() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { getSettings } = await import('../lib/admin-actions');
      const data = await getSettings();
      setSettings(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { settings, isLoading, error, refetch: fetchSettings };
}
