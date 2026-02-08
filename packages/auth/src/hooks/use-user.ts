'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '../supabase/client';
import type { User } from '../types';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!authUser) {
        setUser(null);
        return;
      }
      setUser({
        id: authUser.id,
        email: authUser.email!,
        name: authUser.user_metadata?.full_name || null,
        avatar_url: authUser.user_metadata?.avatar_url || null,
        provider: authUser.app_metadata?.provider || null,
        role: authUser.user_metadata?.role || 'user',
        created_at: authUser.created_at,
        updated_at: authUser.updated_at || authUser.created_at,
        last_sign_in_at: authUser.last_sign_in_at || null,
      });
    } catch (err: any) {
      setError(err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, isLoading, error, refetch: fetchUser };
}
