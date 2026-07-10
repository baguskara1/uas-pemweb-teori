import { createClient } from '@/lib/supabase/server';
import { BookOpen, Camera, DollarSign, TrendingUp } from 'lucide-react';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Menunggu',
  confirmed: 'Dikonfirmasi',
  in_progress: 'Berlangsung',
  returned: 'Dikembalikan',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
};

const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-purple-100 text-purple-700',
  returned: 'bg-indigo-100 text-indigo-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default async function AdminPage() {
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

  // Recent 10 bookings with joins
  const { data: recentBookings } = await supabase
    .from('bookings')
    .select(
      `id, status, final_price, start_date, end_date, created_at,
       camera:cameras(name, brand),
       user:profiles(full_name, email)`,
    )
    .order('created_at', { ascending: false })
    .limit(10);

  const stats = [
    {
      label: 'Total Kamera',
      value: `${totalCameras} unit`,
      sub: `${availableCameras} tersedia`,
      icon: Camera,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Booking Aktif',
      value: activeBookings,
      sub: `dari ${bookings?.length ?? 0} total`,
      icon: BookOpen,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
    {
      label: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      sub: 'booking selesai',
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Semua Booking',
      value: bookings?.length ?? 0,
      sub: 'sepanjang waktu',
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-semibold">Ringkasan Admin</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-surface-light p-6 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="font-text text-sm text-text-tertiary">{s.label}</span>
              <span className={`${s.bg} ${s.color} p-2 rounded-xl`}>
                <s.icon className="h-5 w-5" />
              </span>
            </div>
            <p className="font-display text-2xl font-semibold">{s.value}</p>
            <p className="mt-1 font-text text-xs text-text-tertiary">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl border border-surface-light shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-surface-light">
          <h2 className="font-display text-xl font-semibold">Booking Terbaru</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full font-text text-sm">
            <thead className="bg-[#f5f5f7] text-text-tertiary">
              <tr>
                {['Pengguna', 'Kamera', 'Tanggal', 'Total', 'Status'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-light">
              {recentBookings?.map((b) => (
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
                  <td className="px-6 py-4 text-text-secondary whitespace-nowrap">
                    {b.start_date} → {b.end_date}
                  </td>
                  <td className="px-6 py-4 font-semibold text-primary whitespace-nowrap">
                    {formatCurrency(Number(b.final_price))}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[b.status] ?? 'bg-gray-100 text-gray-600'}`}
                    >
                      {STATUS_LABEL[b.status] ?? b.status}
                    </span>
                  </td>
                </tr>
              ))}
              {(!recentBookings || recentBookings.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-text-tertiary">
                    Belum ada booking
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
