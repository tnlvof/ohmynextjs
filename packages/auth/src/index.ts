// Client-safe exports only
export { createClient } from './supabase/client';
export { AuthForm, SocialButtons, UserButton, AuthGuard } from './components';
export { useUser, useSession } from './hooks';
export type { OAuthProvider, User } from './types';
