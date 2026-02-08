'use server';

import { createClient } from '../supabase/server';
import { redirect } from 'next/navigation';

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/auth/login');
}
