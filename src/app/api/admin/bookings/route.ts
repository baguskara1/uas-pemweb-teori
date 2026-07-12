import { type NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin-guard';
import { withRateLimit } from '@/lib/rate-limit';
import { createClient } from '@/lib/supabase/server';

function isBookingStatus(v: string | null): v is BookingStatus {
  return v !== null && VALID_STATUSES.includes(v as BookingStatus);
}

type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'returned'
  | 'completed'
  | 'cancelled';
const VALID_STATUSES: BookingStatus[] = [
  'pending',
  'confirmed',
  'in_progress',
  'returned',
  'completed',
  'cancelled',
];

async function getBookings(request: NextRequest) {
  const guard = await verifyAdmin();
  if (!guard.allowed) return guard.response;

  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const limit = Math.min(Number(searchParams.get('limit')) || 50, 200);
  const offset = Math.max(Number(searchParams.get('offset')) || 0, 0);

  let query = supabase
    .from('bookings')
    .select(
      `id, status, final_price, start_date, end_date, created_at,
       camera:cameras(name, brand),
       user:profiles(full_name, email)`,
    )
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (isBookingStatus(status)) {
    query = query.eq('status', status);
  }

  const { data: bookings, error } = await query;

  if (error) {
    return NextResponse.json({ message: 'INTERNAL_ERROR' }, { status: 500 });
  }

  return NextResponse.json({ bookings, limit, offset });
}

export const GET = withRateLimit(getBookings);
