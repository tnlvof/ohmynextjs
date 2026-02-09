// Server-only exports (uses next/headers, server actions, etc.)
export { createClient as createServerClient } from './supabase/server';
export { supabaseAdmin } from './supabase/admin';
export { signIn, signUp, signOut, signInWithOAuth, resetPassword } from './actions';
export { updateSession } from './supabase/proxy';
