import { type NextRequest, NextResponse } from 'next/server';
import { generateSnapToken, snapConfig } from '@/lib/midtrans';
import { withRateLimit } from '@/lib/rate-limit';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/payments/midtrans/submit
 * Create Midtrans transaction and generate Snap token
 */
async function handler(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized', error: 'AUTH_REQUIRED' },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { bookingId, paymentMethod } = body;

    if (!bookingId) {
      return NextResponse.json(
        { success: false, message: 'Booking ID is required', error: 'MISSING_BOOKING_ID' },
        { status: 400 },
      );
    }

    // Fetch booking + camera (camera relationship untyped — fetch separately)
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(
        'id, user_id, camera_id, start_date, end_date, duration, total_price, final_price, status',
      )
      .eq('id', bookingId)
      .eq('user_id', user.id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        {
          success: false,
          message: 'Booking not found or unauthorized',
          error: 'BOOKING_NOT_FOUND',
        },
        { status: 404 },
      );
    }

    if (booking.status !== 'pending') {
      return NextResponse.json(
        {
          success: false,
          message: `Booking is in ${booking.status} status`,
          error: 'INVALID_BOOKING_STATUS',
        },
        { status: 400 },
      );
    }

    const { data: camera } = await supabase
      .from('cameras')
      .select('id, name, brand, price_per_day')
      .eq('id', booking.camera_id)
      .single();

    // Profile for customer details (full_name, phone)
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, phone')
      .eq('id', user.id)
      .single();

    const timestamp = Date.now();
    const orderId = `camera-rental-${booking.id}-${timestamp}`;

    // Create payment record — schema columns
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        booking_id: bookingId,
        user_id: user.id,
        midtrans_order_id: orderId,
        amount: booking.final_price,
        method: paymentMethod ?? 'gopay', // ponytail: default to gopay when unset. Caller should pick; QRIS is safe universal fallback.
        status: 'pending',
      })
      .select()
      .single();

    if (paymentError || !payment) {
      console.error('[Payment] Error creating payment record:', paymentError);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to create payment record',
          error: paymentError?.message,
        },
        { status: 500 },
      );
    }

    // Generate Snap token
    const fullName = profile?.full_name ?? user.email?.split('@')[0] ?? 'Customer';
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';

    const snapResponse = await generateSnapToken({
      orderId,
      grossAmount: booking.final_price,
      customerDetails: {
        firstName: fullName.split(' ')[0],
        lastName: fullName.split(' ').slice(1).join(' ') || '',
        email: user.email ?? '',
        phone: profile?.phone ?? '',
      },
      itemDetails: camera
        ? [
            {
              id: camera.id,
              name: camera.name,
              price: camera.price_per_day,
              quantity: booking.duration,
              brand: camera.brand,
              category: 'camera',
            },
          ]
        : undefined,
      callbacks: {
        finish: `${baseUrl}/payment/status?order_id=${orderId}`,
        error: `${baseUrl}/payment/status?order_id=${orderId}`,
        pending: `${baseUrl}/payment/status?order_id=${orderId}`,
      },
    });

    // Update payment with Snap token (single JSONB field stores full response)
    await supabase
      .from('payments')
      .update({
        midtrans_token: snapResponse.token,
        midtrans_response: snapResponse,
        updated_at: new Date().toISOString(),
      })
      .eq('id', payment.id);

    return NextResponse.json(
      {
        success: true,
        message: 'Payment initialized successfully',
        data: {
          paymentId: payment.id,
          orderId,
          snapToken: snapResponse.token,
          snapUrl: snapResponse.redirect_url,
          amount: booking.final_price,
          midtransConfig: snapConfig,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('[Payment] Error in submit handler:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
      },
      { status: 500 },
    );
  }
}

export const POST = withRateLimit(handler);
