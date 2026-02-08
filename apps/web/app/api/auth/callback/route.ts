import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // TODO: Implement OAuth callback - exchange code for session
  const searchParams = request.nextUrl.searchParams;
  const next = searchParams.get('next') ?? '/dashboard';
  return NextResponse.redirect(new URL(next, request.url));
}
