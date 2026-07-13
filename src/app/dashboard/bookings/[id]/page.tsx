import { Calendar, Camera, ChevronLeft, Clock, CreditCard, Package } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { CancelBookingButton } from '@/components/dashboard/CancelBookingButton';
import { PayNowButton } from '@/components/dashboard/PayNowButton';
import { createClient } from '@/lib/supabase/server';

type PageProps = {
  params: Promise<{ id: string }>;
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Menunggu', color: 'text-primary', bg: 'bg-primary/10' },
  confirmed: { label: 'Dikonfirmasi', color: 'text-primary', bg: 'bg-primary/20' },
  in_progress: { label: 'Berlangsung', color: 'text-green-700', bg: 'bg-green-100' },
  returned: { label: 'Dikembalikan', color: 'text-gray-700', bg: 'bg-gray-100' },
  completed: { label: 'Selesai', color: 'text-gray-700', bg: 'bg-gray-100' },
  cancelled: { label: 'Dibatalkan', color: 'text-red-700', bg: 'bg-red-100' },
};

export default async function BookingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: booking, error } = await supabase
    .from('bookings')
    .select(
      `
      id,
      start_date,
      end_date,
      duration,
      total_price,
      discount_amount,
      final_price,
      status,
      order_group,
      created_at,
      camera:cameras (
        id,
        name,
        brand,
        type,
        category,
        price_per_day,
        image_url
      )
    `,
    )
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !booking) notFound();

  // Get all bookings in same order_group (bundle)
  let bundleItems: {
    id: string;
    camera: { id: string; name: string; brand: string; type: string; category: string; price_per_day: number; image_url: string | null };
  }[] = [];

  if (booking.order_group) {
    const { data: groupBookings } = await supabase
      .from('bookings')
      .select(`
        id,
        camera:cameras (
          id, name, brand, type, category, price_per_day, image_url
        )
      `)
      .eq('order_group', booking.order_group)
      .eq('user_id', user.id);

    if (groupBookings) {
      bundleItems = groupBookings;
    }
  }

  const statusStyle = statusConfig[booking.status] || statusConfig.pending;
  const isBundle = bundleItems.length > 1;

  const formatCurrency = (value: number) => `Rp ${Math.round(value).toLocaleString('id-ID')}`;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-4xl space-y-6">
      <Link
        href="/dashboard/bookings"
        className="inline-flex items-center gap-2 text-text-secondary hover:text-text-dominant font-text text-sm"
      >
        <ChevronLeft className="w-4 h-4" />
        Kembali ke Daftar Booking
      </Link>

      <div className="bg-white rounded-2xl border border-surface-light p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="font-display text-2xl font-semibold mb-2">
              {isBundle ? 'Detail Bundle Sewa' : 'Detail Booking'}
            </h1>
            <p className="text-sm text-text-tertiary">ID: {booking.id}</p>
            {booking.order_group && (
              <p className="text-xs text-text-tertiary mt-0.5">Group: {booking.order_group.slice(0, 8)}...</p>
            )}
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${statusStyle.bg} ${statusStyle.color}`}
          >
            {statusStyle.label}
          </span>
        </div>

        {/* Bundle Items */}
        <div className="mb-8 pb-8 border-b border-surface-light">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-primary" />
            <h2 className="font-display text-base font-semibold">
              {isBundle ? `Item Bundle (${bundleItems.length})` : 'Item'}
            </h2>
          </div>
          <div className="space-y-3">
            {bundleItems.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 rounded-xl bg-surface-dark/50">
                <div className="w-16 h-16 rounded-xl bg-surface-light flex items-center justify-center shrink-0 overflow-hidden">
                  {item.camera.image_url ? (
                    <Image
                      src={item.camera.image_url}
                      alt={item.camera.name}
                      width={64}
                      height={64}
                      loading="lazy"
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-6 h-6 text-text-tertiary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/cameras/${item.camera.id}`} className="hover:underline">
                    <h3 className="font-display font-semibold">{item.camera.name}</h3>
                  </Link>
                  <p className="text-xs text-text-tertiary">
                    {item.camera.brand} • {item.camera.type}
                  </p>
                  <p className="text-xs text-primary font-semibold mt-0.5">
                    {formatCurrency(item.camera.price_per_day)} / hari
                  </p>
                </div>
                {item.id === booking.id && (
                  <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full self-start">
                    Active
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Booking Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex gap-3">
            <Calendar className="w-5 h-5 text-primary shrink-0 mt-1" />
            <div>
              <p className="text-sm text-text-tertiary mb-1">Periode Sewa</p>
              <p className="font-semibold">{formatDate(booking.start_date)}</p>
              <p className="font-semibold">{formatDate(booking.end_date)}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Clock className="w-5 h-5 text-primary shrink-0 mt-1" />
            <div>
              <p className="text-sm text-text-tertiary mb-1">Durasi</p>
              <p className="font-semibold">{booking.duration} hari</p>
            </div>
          </div>

          <div className="flex gap-3">
            <CreditCard className="w-5 h-5 text-primary shrink-0 mt-1" />
            <div>
              <p className="text-sm text-text-tertiary mb-1">Dibuat Pada</p>
              <p className="font-semibold">{formatDateTime(booking.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-surface-light/30 rounded-xl p-6 mb-6">
          <h3 className="font-display text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-4">
            Rincian Biaya
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">
                {formatCurrency(booking.camera.price_per_day)} × {booking.duration} hari
              </span>
              <span className="font-medium">{formatCurrency(booking.total_price)}</span>
            </div>
            {booking.discount_amount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Diskon Loyalty</span>
                <span className="font-medium text-green-600">
                  -{formatCurrency(booking.discount_amount)}
                </span>
              </div>
            )}
            <div className="border-t border-surface-light pt-3 flex justify-between items-baseline">
              <span className="font-display text-base font-semibold">Total Bayar</span>
              <span className="font-display text-2xl font-semibold text-primary">
                {formatCurrency(booking.final_price)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {booking.status === 'pending' && (
          <div className="flex justify-end">
            <CancelBookingButton bookingId={booking.id} />
          </div>
        )}
        {booking.status === 'confirmed' && (
          <div className="flex flex-col items-end gap-4">
            <div className="text-right">
              <p className="text-sm text-text-tertiary mb-1">Booking telah dikonfirmasi</p>
              <p className="text-xs text-text-tertiary">Selesaikan pembayaran untuk mengaktifkan sewa</p>
            </div>
            <div className="flex gap-3 items-center">
              <CancelBookingButton bookingId={booking.id} label="Batalkan Pembayaran" />
              <PayNowButton bookingId={booking.id} orderGroup={booking.order_group} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
