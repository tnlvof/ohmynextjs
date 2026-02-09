import { NextRequest, NextResponse } from 'next/server';

const TOSS_API_URL = 'https://api.tosspayments.com/v1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentKey, orderId, amount } = body;

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { error: { code: 'INVALID_PARAMS', message: '필수 파라미터가 누락되었습니다' } },
        { status: 400 }
      );
    }

    const secretKey = process.env.TOSS_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: { code: 'CONFIG_ERROR', message: 'Payment configuration error' } },
        { status: 500 }
      );
    }

    const authHeader = `Basic ${Buffer.from(secretKey + ':').toString('base64')}`;

    const tossResponse = await fetch(`${TOSS_API_URL}/payments/confirm`, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    });

    if (!tossResponse.ok) {
      const errorData = await tossResponse.json();
      const failUrl = new URL('/payment/fail', request.url);
      failUrl.searchParams.set('code', errorData.code ?? 'PAYMENT_FAILED');
      failUrl.searchParams.set('message', errorData.message ?? '결제 승인에 실패했습니다');
      return NextResponse.redirect(failUrl, { status: 303 });
    }

    const successUrl = new URL('/payment/success', request.url);
    successUrl.searchParams.set('orderId', orderId);
    successUrl.searchParams.set('paymentKey', paymentKey);
    successUrl.searchParams.set('amount', String(amount));

    return NextResponse.redirect(successUrl, { status: 303 });
  } catch (error) {
    const failUrl = new URL('/payment/fail', request.url);
    failUrl.searchParams.set('code', 'UNKNOWN_ERROR');
    failUrl.searchParams.set('message', '결제 승인 중 오류가 발생했습니다');
    return NextResponse.redirect(failUrl, { status: 303 });
  }
}
