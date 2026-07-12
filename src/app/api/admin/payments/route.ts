import { type NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin-guard';
import { withRateLimit } from '@/lib/rate-limit';
import { createClient } from '@/lib/supabase/server';

type PaymentStatus = 'pending' | 'paid' | 'failed' | 'expired';
const VALID_STATUSES: PaymentStatus[] = ['pending', 'paid', 'failed', 'expired'];

function isPaymentStatus(v: string | null): v is PaymentStatus {
  return v !== null && VALID_STATUSES.includes(v as PaymentStatus);
}

async function getPayments(request: NextRequest) {
  const guard = await verifyAdmin();
  if (!guard.allowed) return guard.response;

  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const search = searchParams.get('search') || '';
  const limit = Math.min(Number(searchParams.get('limit')) || 50, 200);
  const offset = Math.max(Number(searchParams.get('offset')) || 0, 0);

  let query = supabase
    .from('payments')
    .select(
      `id, booking_id, amount, method, status, paid_at, created_at,
       booking:bookings!inner(user:profiles(full_name, email))`,
    )
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (isPaymentStatus(status)) {
    query = query.eq('status', status);
  }

  if (search) {
    const escaped = search.replace(/[%_]/g, '\\$&');
    query = query.or(`booking_id.ilike.%${escaped}%,id.ilike.%${escaped}%`);
  }

  const { data: payments, error } = await query;

  if (error) {
    return NextResponse.json({ message: 'INTERNAL_ERROR' }, { status: 500 });
  }

  return NextResponse.json({ payments, limit, offset });
}

export const GET = withRateLimit(getPayments);
