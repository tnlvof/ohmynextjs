import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { EmailOtpType } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tokenHash = searchParams.get('token_hash');
  const type = (searchParams.get('type') ?? 'signup') as EmailOtpType;

  if (!tokenHash) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('error', 'missing_token');
    return NextResponse.redirect(loginUrl);
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type,
  });

  if (error) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('error', error.message);
    return NextResponse.redirect(loginUrl);
  }

  const redirectTo = type === 'recovery' ? '/auth/reset-password' : '/dashboard';
  return NextResponse.redirect(new URL(redirectTo, request.url));
}
