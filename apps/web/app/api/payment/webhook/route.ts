import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // TODO: Implement Toss webhook handler with signature verification
  return NextResponse.json({ error: { code: 'NOT_IMPLEMENTED', message: 'Not yet implemented' } }, { status: 501 });
}
