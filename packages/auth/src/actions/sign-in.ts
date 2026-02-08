'use server';

import { createClient } from '../supabase/server';
import { redirect } from 'next/navigation';
import { AUTH_ERRORS, type SignInInput, type AuthError } from '../types';

export async function signIn(input: SignInInput): Promise<{ error?: AuthError }> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error) {
    if (error.message === 'Invalid login credentials') {
      return { error: { code: 'AUTH_INVALID_CREDENTIALS', message: AUTH_ERRORS.AUTH_INVALID_CREDENTIALS } };
    }
    if (error.message === 'Email not confirmed') {
      return { error: { code: 'AUTH_EMAIL_NOT_CONFIRMED', message: AUTH_ERRORS.AUTH_EMAIL_NOT_CONFIRMED } };
    }
    if (error.message === 'User is banned') {
      return { error: { code: 'AUTH_USER_BANNED', message: AUTH_ERRORS.AUTH_USER_BANNED } };
    }
    return { error: { code: 'AUTH_UNKNOWN', message: error.message } };
  }

  redirect('/dashboard');
}
