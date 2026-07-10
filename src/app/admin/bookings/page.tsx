import { StatusBadge, STATUS_LABEL, StatusSelect } from '@/components/admin/BookingStatus';
import type { BookingStatus } from '@/actions/admin-booking';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

const STATUS_FILTERS = [
  'all',
  'pending',
  'confirmed',
  'in_progress',
  'returned',
  'completed',
  'cancelled',
] as const;

function formatCurrency(v: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(v);
}

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
      <h1 className="font-display text-3xl font-semibold">Manajemen Booking</h1>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => {
          const active = (status ?? 'all') === s;
          const label = s === 'all' ? 'Semua' : STATUS_LABEL[s as keyof typeof STATUS_LABEL];
          return (
            <Link
              key={s}
              href={`/admin/bookings?status=${s}`}
              className={`px-4 py-2 rounded-full font-text text-sm font-semibold transition-colors ${
                active
                  ? 'bg-primary text-white'
                  : 'bg-white border border-surface-light text-text-secondary hover:border-primary hover:text-primary'
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-surface-light shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full font-text text-sm">
            <thead className="bg-[#f5f5f7] text-text-tertiary">
              <tr>
                {['Pengguna', 'Kamera', 'Periode', 'Total', 'Status', 'Aksi'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-light">
              {bookings?.map((b) => (
                <tr key={b.id} className="hover:bg-[#f5f5f7]/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-text-dominant">
                      {(b.user as { full_name: string } | null)?.full_name ?? '-'}
                    </p>
                    <p className="text-xs text-text-tertiary">
                      {(b.user as { email: string } | null)?.email ?? ''}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p>{(b.camera as { name: string } | null)?.name ?? '-'}</p>
                    <p className="text-xs text-text-tertiary">
                      {(b.camera as { brand: string } | null)?.brand ?? ''}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                    {b.start_date} → {b.end_date}
                  </td>
                  <td className="px-6 py-4 font-semibold text-primary whitespace-nowrap">
                    {formatCurrency(Number(b.final_price))}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <StatusSelect bookingId={b.id} current={b.status as 'pending'} />
                      <Link
                        href={`/admin/bookings/${b.id}`}
                        className="text-xs text-primary font-semibold hover:underline whitespace-nowrap"
                      >
                        Detail
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {(!bookings || bookings.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-tertiary">
                    Tidak ada booking
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
