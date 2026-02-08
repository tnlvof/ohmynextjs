import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // TODO: Implement email confirmation - verify OTP
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') ?? 'signup';
  const redirectTo = type === 'recovery' ? '/auth/reset-password' : '/dashboard';
  return NextResponse.redirect(new URL(redirectTo, request.url));
}
