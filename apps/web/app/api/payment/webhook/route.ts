import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';

function verifyWebhookSignature(body: string, signature: string, secretKey: string): boolean {
  const expectedSignature = createHmac('sha256', secretKey)
    .update(body)
    .digest('base64');
  return signature === expectedSignature;
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('TossPayments-Signature') ?? '';
    const secretKey = process.env.TOSS_SECRET_KEY;

    if (!secretKey) {
      console.error('[webhook] TOSS_SECRET_KEY is not configured');
      return NextResponse.json({ success: false }, { status: 500 });
    }

    // Verify signature if present
    if (signature && !verifyWebhookSignature(rawBody, signature, secretKey)) {
      console.error('[webhook] Invalid signature');
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const { eventType, data } = payload;

    // Log webhook event for debugging
    console.log(`[webhook] Received event: ${eventType}`, {
      paymentKey: data?.paymentKey,
      orderId: data?.orderId,
      status: data?.status,
    });

    // Handle payment status changes
    switch (eventType) {
      case 'PAYMENT_STATUS_CHANGED': {
        // Payment status changed (e.g., virtual account deposit confirmation)
        // In a full implementation, update the payment record in the database
        console.log(`[webhook] Payment ${data?.paymentKey} status changed to ${data?.status}`);
        break;
      }
      case 'BILLING_KEY_STATUS_CHANGED': {
        // Billing key status changed
        console.log(`[webhook] Billing key status changed for customer ${data?.customerKey}`);
        break;
      }
      case 'PAYOUT_STATUS_CHANGED': {
        // Payout status changed
        console.log(`[webhook] Payout status changed`);
        break;
      }
      default: {
        console.log(`[webhook] Unhandled event type: ${eventType}`);
        break;
      }
    }

    // Always respond 200 to acknowledge receipt
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[webhook] Error processing webhook:', error);
    // Return 200 anyway to prevent retries for parse errors
    return NextResponse.json({ success: true }, { status: 200 });
  }
}
