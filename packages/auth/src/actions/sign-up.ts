'use server';

import { createClient } from '../supabase/server';
import { redirect } from 'next/navigation';
import { AUTH_ERRORS, type SignUpInput, type AuthError } from '../types';

export async function signUp(input: SignUpInput): Promise<{ error?: AuthError }> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        full_name: input.name,
      },
    },
  });

  if (error) {
    if (error.message.includes('already registered')) {
      return { error: { code: 'AUTH_EMAIL_EXISTS', message: AUTH_ERRORS.AUTH_EMAIL_EXISTS } };
    }
    if (error.message.includes('Password should be at least')) {
      return { error: { code: 'AUTH_WEAK_PASSWORD', message: AUTH_ERRORS.AUTH_WEAK_PASSWORD } };
    }
    return { error: { code: 'AUTH_UNKNOWN', message: error.message } };
  }

  redirect('/auth/verify-email');
}
