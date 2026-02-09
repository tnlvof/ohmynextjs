'use server';

import { createClient } from '../supabase/server';
import { redirect } from 'next/navigation';
import type { OAuthProvider } from '../types';

export async function signInWithOAuth(provider: OAuthProvider): Promise<void> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as any,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
      queryParams: provider === 'kakao' ? { prompt: 'login' } : undefined,
    },
  });

  if (error) {
    throw error;
  }

  redirect(data.url);
}
