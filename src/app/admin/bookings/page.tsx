import Link from 'next/link';
import { AdminBookingsTable } from '@/components/admin/AdminBookingsTable';
import { BOOKING_STATUS_LABEL, type BookingStatus } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';

const STATUS_FILTERS = [
  'all',
  'pending',
  'confirmed',
  'in_progress',
  'returned',
  'completed',
  'cancelled',
] as const;

type SearchParams = Promise<{ status?: string }>;

export default async function AdminBookingsPage({ searchParams }: { searchParams: SearchParams }) {
  const { status } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('bookings')
    .select(
      `id, status, final_price, start_date, end_date, created_at,
       camera:cameras(name, brand),
       user:profiles(full_name, email)`,
    )
    .order('created_at', { ascending: false });

  if (status && status !== 'all') {
    query = query.eq('status', status as BookingStatus);
  }

  const { data: bookings } = await query;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-semibold text-text-dominant">Manajemen Booking</h1>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => {
          const active = (status ?? 'all') === s;
          const label = s === 'all' ? 'Semua' : BOOKING_STATUS_LABEL[s as keyof typeof BOOKING_STATUS_LABEL];
          return (
            <Link
              key={s}
              href={`/admin/bookings?status=${s}`}
              className={`px-4 py-2 rounded-full font-text text-sm font-semibold transition-colors ${
                active
                  ? 'bg-primary text-white'
                  : 'bg-white border border-black/10 text-text-tertiary hover:border-primary hover:text-primary'
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      <AdminBookingsTable bookings={bookings ?? []} />
    </div>
  );
}
