'use client';

import { useState, useEffect } from 'react';
import { createClient } from '../supabase/client';

interface Session {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  user: any;
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s as Session | null);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        setSession(s as Session | null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return {
    session,
    isAuthenticated: !!session,
    isLoading,
  };
}
