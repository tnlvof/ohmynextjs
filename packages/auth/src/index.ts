export { createClient } from './supabase/client';
export { createClient as createServerClient } from './supabase/server';
export { supabaseAdmin } from './supabase/admin';
export { signIn, signUp, signOut, signInWithOAuth, resetPassword } from './actions';
export { AuthForm, SocialButtons, UserButton, AuthGuard } from './components';
export { useUser, useSession } from './hooks';
export { authMiddleware, protectedRoutes, adminRoutes } from './middleware';
export type { OAuthProvider, User } from './types';
