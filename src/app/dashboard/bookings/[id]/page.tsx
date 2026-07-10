import { createClient } from '@/lib/supabase/server';
import { Calendar, Camera, ChevronLeft, Clock, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { CancelBookingButton } from '@/components/dashboard/CancelBookingButton';

type PageProps = {
  params: Promise<{ id: string }>;
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Menunggu', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  confirmed: { label: 'Dikonfirmasi', color: 'text-blue-700', bg: 'bg-blue-100' },
  active: { label: 'Aktif', color: 'text-green-700', bg: 'bg-green-100' },
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
      created_at,
      camera:cameras (
        id,
        name,
        brand,
        type,
        price_per_day,
        image_url
      )
    `,
    )
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !booking) notFound();

  const statusStyle = statusConfig[booking.status] || statusConfig.pending;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value);
  };

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
            <h1 className="font-display text-2xl font-semibold mb-2">Detail Booking</h1>
            <p className="text-sm text-text-tertiary">ID: {booking.id}</p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${statusStyle.bg} ${statusStyle.color}`}
          >
            {statusStyle.label}
          </span>
        </div>

        {/* Camera Info */}
        <div className="flex gap-6 mb-8 pb-8 border-b border-surface-light">
          <div className="w-32 h-32 rounded-xl bg-surface-light flex items-center justify-center flex-shrink-0">
            {booking.camera.image_url ? (
              <img
                src={booking.camera.image_url}
                alt={booking.camera.name}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <Camera className="w-12 h-12 text-text-tertiary" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="font-display text-xl font-semibold mb-1">{booking.camera.name}</h2>
            <p className="text-text-secondary mb-2">
              {booking.camera.brand} • {booking.camera.type}
            </p>
            <p className="text-sm text-text-tertiary">
              {formatCurrency(booking.camera.price_per_day)} / hari
            </p>
          </div>
        </div>

        {/* Booking Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex gap-3">
            <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm text-text-tertiary mb-1">Periode Sewa</p>
              <p className="font-semibold">{formatDate(booking.start_date)}</p>
              <p className="font-semibold">{formatDate(booking.end_date)}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm text-text-tertiary mb-1">Durasi</p>
              <p className="font-semibold">{booking.duration} hari</p>
            </div>
          </div>

          <div className="flex gap-3">
            <CreditCard className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
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
                <span className="text-text-secondary">Diskon</span>
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
      </div>
    </div>
  );
}
