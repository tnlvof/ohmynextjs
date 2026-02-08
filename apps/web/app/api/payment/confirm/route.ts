import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // TODO: Implement payment confirmation with Toss
  return NextResponse.json({ error: { code: 'NOT_IMPLEMENTED', message: 'Not yet implemented' } }, { status: 501 });
}
