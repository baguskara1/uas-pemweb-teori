import { type NextRequest, NextResponse } from 'next/server';
import { validateSignature } from '@/lib/midtrans';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/payments/midtrans/callback
 * Handle Midtrans payment notification webhook.
 * Uses SECURITY DEFINER RPC `update_payment_from_webhook` to bypass RLS safely
 * (anon role has EXECUTE only, not SELECT/UPDATE on payments).
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify webhook signature
    const signatureKey = request.headers.get('x-signature') || '';
    if (!signatureKey) {
      return NextResponse.json({ success: false, message: 'Missing signature' }, { status: 403 });
    }

    const body = await request.json();
    // Midtrans webhook payload uses snake_case: order_id, status_code, gross_amount.
    const orderId = body.order_id ?? body.orderId;
    const statusCode = body.status_code ?? body.statusCode;
    const grossAmount = String(body.gross_amount ?? body.grossAmount ?? '');

    // Validate signature before any DB call
    if (!validateSignature(orderId, statusCode, grossAmount, signatureKey)) {
      return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 403 });
    }

    // Map Midtrans transaction_status + fraud_status -> payment_status
    const transactionStatus = body.transaction_status || '';
    const fraudStatus = body.fraud_status || '';
    let paymentStatus: 'pending' | 'paid' | 'failed' | 'expired' = 'pending';

    if (transactionStatus === 'capture') {
      paymentStatus = fraudStatus === 'accept' ? 'paid' : 'pending';
    } else if (transactionStatus === 'settlement') {
      paymentStatus = 'paid';
    } else if (transactionStatus === 'pending') {
      paymentStatus = 'pending';
    } else if (transactionStatus === 'deny') {
      paymentStatus = 'failed';
    } else if (transactionStatus === 'cancel' || transactionStatus === 'expire') {
      paymentStatus = 'expired';
    }

    // Idempotency check is handled safely inside the RPC `update_payment_from_webhook`
    // via a FOR UPDATE lock.

    // Call RPC — anon role has EXECUTE only; SECURITY DEFINER bypasses RLS inside function.
    const { data: paymentId, error: rpcError } = await supabase.rpc('update_payment_from_webhook', {
      p_order_id: orderId,
      p_status: paymentStatus,
      p_payload: JSON.stringify(body),
      p_paid_at: paymentStatus === 'paid' ? new Date().toISOString() : '',
    });

    if (rpcError) {
      console.error('[Webhook] RPC error:', rpcError);
      return NextResponse.json(
        { success: false, message: 'Failed to update payment' },
        { status: 500 },
      );
    }

    if (!paymentId) {
      return NextResponse.json({ success: false, message: 'Payment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Webhook processed' }, { status: 200 });
  } catch (error) {
    console.error('[Webhook] Error processing callback:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
