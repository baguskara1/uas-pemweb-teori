import { type NextRequest, NextResponse } from 'next/server';
import { chargeQris, generateSnapToken, methodMap, snapConfig } from '@/lib/midtrans';
import { withRateLimit } from '@/lib/rate-limit';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database';

// UUID v4 regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidUUID(str: string): boolean {
  return UUID_REGEX.test(str);
}

function isValidISODate(str: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}/.test(str)) return false;
  const date = new Date(str);
  return date instanceof Date && !Number.isNaN(date.getTime());
}

function isTodayOrLater(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const input = new Date(dateStr);
  return input >= today;
}

async function handler(request: NextRequest) {
  try {
    const supabase = await createClient();

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
    console.log('[Multi-Submit] Received body:', JSON.stringify(body, null, 2));
    const { items, payMethod, start_date, end_date } = body as {
      items: { id: string; start_date: string; end_date: string; duration: number }[];
      payMethod?: string;
      start_date: string;
      end_date: string;
    };
    console.log('[Multi-Submit] Parsed:', { itemsCount: items?.length, payMethod, start_date, end_date });

    // ---- VALIDATION START ----

    // 1. items: array non-empty
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Field "items" harus array non-empty', error: 'INVALID_ITEMS' },
        { status: 400 },
      );
    }

    // 2. Each item: id (valid UUID) & duration (integer > 0)
    for (const [idx, item] of items.entries()) {
      if (!item.id || !isValidUUID(item.id)) {
        return NextResponse.json(
          {
            success: false,
            message: `items[${idx}].id harus UUID v4 valid`,
            error: 'INVALID_ITEM_ID',
          },
          { status: 400 },
        );
      }
      const dur = item.duration;
      if (typeof dur !== 'number' || !Number.isInteger(dur) || dur <= 0) {
        return NextResponse.json(
          {
            success: false,
            message: `items[${idx}].duration harus integer > 0`,
            error: 'INVALID_ITEM_DURATION',
          },
          { status: 400 },
        );
      }
    }

    // 3. start_date & end_date: valid ISO date, start_date >= today, end_date > start_date
    if (!start_date || !isValidISODate(start_date)) {
      return NextResponse.json(
        { success: false, message: 'start_date harus ISO date valid', error: 'INVALID_START_DATE' },
        { status: 400 },
      );
    }
    if (!end_date || !isValidISODate(end_date)) {
      return NextResponse.json(
        { success: false, message: 'end_date harus ISO date valid', error: 'INVALID_END_DATE' },
        { status: 400 },
      );
    }
    if (!isTodayOrLater(start_date)) {
      return NextResponse.json(
        {
          success: false,
          message: 'start_date harus hari ini atau masa depan',
          error: 'START_DATE_PAST',
        },
        { status: 400 },
      );
    }
    if (new Date(end_date) <= new Date(start_date)) {
      return NextResponse.json(
        {
          success: false,
          message: 'end_date harus lebih besar dari start_date',
          error: 'END_DATE_BEFORE_START',
        },
        { status: 400 },
      );
    }

    // 4. payMethod: must be a key of methodMap
    if (!payMethod || !(payMethod in methodMap)) {
      const validMethods = Object.keys(methodMap).join(', ');
      return NextResponse.json(
        {
          success: false,
          message: `payMethod harus salah satu dari: ${validMethods}`,
          error: 'INVALID_PAY_METHOD',
        },
        { status: 400 },
      );
    }

    // ---- VALIDATION END ----

    const dbMethod = methodMap[payMethod] as Database['public']['Enums']['payment_method'];

    // Get camera details for each item
    const cameraIds = items.map((i) => i.id);
    const { data: cameras, error: cameraError } = await supabase
      .from('cameras')
      .select('id, name, brand, price_per_day')
      .in('id', cameraIds);

    if (cameraError || !cameras || cameras.length !== cameraIds.length) {
      return NextResponse.json(
        {
          success: false,
          message: 'Satu atau lebih kamera tidak ditemukan',
          error: 'CAMERA_NOT_FOUND',
        },
        { status: 404 },
      );
    }

    // Create bookings one by one via the RPC
    const bookingIds: string[] = [];
    let totalAmount = 0;
    const cameraDetails: {
      id: string;
      name: string;
      brand: string;
      price_per_day: number;
      duration: number;
    }[] = [];

    for (const item of items) {
      const cam = cameras.find((c) => c.id === item.id)!;
      const itemStart = item.start_date || start_date;
      const itemEnd = item.end_date || end_date;
      const { data: bookingData, error: bookingError } = await supabase.rpc(
        'create_booking_with_loyalty',
        {
          p_camera_id: item.id,
          p_start_date: itemStart,
          p_end_date: itemEnd,
          p_duration: item.duration,
          p_total_price: cam.price_per_day * item.duration,
        },
      );

      if (bookingError || !bookingData?.[0]) {
        if (bookingIds.length > 0) {
          await supabase.from('bookings').update({ status: 'cancelled' }).in('id', bookingIds);
        }
        return NextResponse.json(
          {
            success: false,
            message: bookingError?.message || 'Failed to create booking',
            error: 'BOOKING_FAILED',
          },
          { status: 500 },
        );
      }

      const bookingId = bookingData[0].booking_id;
      bookingIds.push(bookingId);
      totalAmount += Number(bookingData[0].final_price);
      cameraDetails.push({
        id: cam.id,
        name: cam.name,
        brand: cam.brand,
        price_per_day: cam.price_per_day,
        duration: item.duration,
      });
    }

    // Link all bookings with same order_group
    const orderGroup = crypto.randomUUID();
    await supabase.from('bookings').update({ order_group: orderGroup }).in('id', bookingIds);

    // Create a single payment
    const orderId = `CR-M${orderGroup.slice(0, 8)}-${Date.now()}`;

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, phone')
      .eq('id', user.id)
      .single();

    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        booking_id: bookingIds[0],
        user_id: user.id,
        midtrans_order_id: orderId,
        amount: totalAmount,
        method: dbMethod,
        status: 'pending',
      })
      .select()
      .single();

    if (paymentError || !payment) {
      await supabase.from('bookings').update({ status: 'cancelled' }).in('id', bookingIds);
      return NextResponse.json(
        { success: false, message: 'Failed to create payment', error: 'PAYMENT_CREATE_FAILED' },
        { status: 500 },
      );
    }

    // Generate Snap token for the total
    const fullName = profile?.full_name ?? user.email?.split('@')[0] ?? 'Customer';
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';

    const itemDetails = cameraDetails.map((c) => ({
      id: c.id,
      name: c.name,
      price: c.price_per_day,
      quantity: c.duration,
      brand: c.brand,
      category: 'camera',
    }));

    // QRIS: charge langsung tanpa Snap
    if (payMethod === 'qris') {
      const qrisResponse = await chargeQris({
        orderId,
        grossAmount: totalAmount,
        itemDetails,
      });

      await supabase
        .from('payments')
        .update({
          midtrans_token: qrisResponse.qrString,
          midtrans_response: qrisResponse,
          updated_at: new Date().toISOString(),
        })
        .eq('id', payment.id);

      return NextResponse.json(
        {
          success: true,
          message: 'QRIS payment initialized',
          data: {
            paymentId: payment.id,
            orderId,
            method: 'qris',
            qrString: qrisResponse.qrString,
            amount: totalAmount,
          },
        },
        { status: 200 },
      );
    }

    // Non-QRIS: lewat Snap seperti biasa
    const snapResponse = await generateSnapToken({
      orderId,
      grossAmount: totalAmount,
      customerDetails: {
        firstName: fullName.split(' ')[0],
        lastName: fullName.split(' ').slice(1).join(' ') || '',
        email: user.email ?? '',
        phone: profile?.phone ?? '',
      },
      itemDetails,
      callbacks: {
        finish: `${baseUrl}/dashboard/bookings`,
        error: `${baseUrl}/dashboard/bookings`,
        pending: `${baseUrl}/dashboard/bookings`,
      },
    });

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
        message: 'Multi-item payment initialized',
        data: {
          paymentId: payment.id,
          orderId,
          snapToken: snapResponse.token,
          snapUrl: snapResponse.redirect_url,
          amount: totalAmount,
          midtransConfig: snapConfig,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('[Multi-Payment] Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: 'INTERNAL_ERROR',
      },
      { status: 500 },
    );
  }
}

export const POST = withRateLimit(handler);
