'use server';

import { createClient } from '../supabase/server';
import type { AuthError } from '../types';

export async function resetPassword(email: string): Promise<{ error?: AuthError }> {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  });

  if (error) {
    return { error: { code: 'AUTH_UNKNOWN', message: error.message } };
  }

  return {};
}

export async function updatePassword(newPassword: string): Promise<{ error?: AuthError }> {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    return { error: { code: 'AUTH_UNKNOWN', message: error.message } };
  }

  return {};
}
