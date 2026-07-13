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
      `id, status, final_price, start_date, end_date, created_at, order_group,
       camera:cameras(name, brand),
       user:profiles(full_name, email)`,
    )
    .order('created_at', { ascending: false });

  if (status && status !== 'all') {
    query = query.eq('status', status as BookingStatus);
  }

  const { data: rawBookings } = await query;

  let groupedBookings: any[] = [];
  if (rawBookings) {
    const groups = new Map();
    for (const b of rawBookings) {
      if (b.order_group) {
        if (!groups.has(b.order_group)) {
          groups.set(b.order_group, []);
        }
        groups.get(b.order_group).push(b);
      } else {
        groupedBookings.push(b);
      }
    }

    for (const [groupId, items] of groups.entries()) {
      if (items.length === 1) {
        groupedBookings.push(items[0]);
      } else {
        const first = items[0];
        const total = items.reduce((sum: number, item: any) => sum + Number(item.final_price), 0);
        groupedBookings.push({
          id: `group_${groupId}`,
          status: first.status,
          final_price: total,
          start_date: first.start_date,
          end_date: first.end_date,
          created_at: first.created_at,
          camera: { name: `Paket Sewa (${items.length} Barang)`, brand: 'Multiple Items' },
          user: first.user,
        });
      }
    }
  }

  // Re-sort because grouping might mess up the chronological order of groups vs singles
  groupedBookings.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

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

      <AdminBookingsTable bookings={groupedBookings} />
    </div>
  );
}
