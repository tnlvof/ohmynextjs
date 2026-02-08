// This module wraps the auth package's server-side user retrieval
// Separated for testability (easy to mock)
import type { User } from '@ohmynextjs/auth';

export async function getCurrentUser(): Promise<User | null> {
  // In a real app, this would use server-side auth
  // e.g., cookies-based session check via supabase server client
  const { createServerClient } = await import('@ohmynextjs/auth');
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const supabase = createServerClient(cookieStore as any);
  const { data: { user } } = await (supabase as any).auth.getUser();
  if (!user) return null;
  return {
    id: user.id,
    email: user.email!,
    name: user.user_metadata?.full_name || null,
    avatar_url: user.user_metadata?.avatar_url || null,
    provider: user.app_metadata?.provider || null,
    role: user.user_metadata?.role || 'user',
    created_at: user.created_at,
    updated_at: user.updated_at || user.created_at,
    last_sign_in_at: user.last_sign_in_at || null,
  };
}
