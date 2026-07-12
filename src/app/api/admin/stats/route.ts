import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin-guard';
import { withRateLimit } from '@/lib/rate-limit';
import { createClient } from '@/lib/supabase/server';

async function getStats(_request: NextRequest) {
  const guard = await verifyAdmin();
  if (!guard.allowed) return guard.response;

  const supabase = await createClient();

  const [{ data: cameras }, { data: bookings }, { data: revenue }] = await Promise.all([
    supabase.from('cameras').select('id, is_available', { count: 'exact' }),
    supabase.from('bookings').select('id, status', { count: 'exact' }),
    supabase.from('bookings').select('final_price').in('status', ['completed', 'returned']),
  ]);

  const totalCameras = cameras?.length ?? 0;
  const availableCameras = cameras?.filter((c) => c.is_available).length ?? 0;
  const activeBookings =
    bookings?.filter((b) => ['pending', 'confirmed', 'in_progress'].includes(b.status)).length ?? 0;
  const totalRevenue = revenue?.reduce((sum, b) => sum + Number(b.final_price), 0) ?? 0;

  return NextResponse.json({
    totalCameras,
    availableCameras,
    activeBookings,
    totalBookings: bookings?.length ?? 0,
    totalRevenue,
  });
}

export const GET = withRateLimit(getStats);
