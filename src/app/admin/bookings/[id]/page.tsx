import { Calendar, Camera, ChevronLeft, CreditCard, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { StatusBadge, StatusSelect } from '@/components/admin/BookingStatus';
import { createClient } from '@/lib/supabase/server';

function formatCurrency(v: number): string {
  return `Rp ${Math.round(v).toLocaleString('id-ID')}`;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-black/10 last:border-0">
      <span className="font-text text-sm text-text-tertiary">{label}</span>
      <span className="font-text text-sm font-semibold text-text-dominant">{value}</span>
    </div>
  );
}

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: booking } = await supabase
    .from('bookings')
    .select(
      `id, status, start_date, end_date, duration, total_price, discount_amount, final_price, notes, created_at,
       camera:cameras(id, name, brand, type, price_per_day, image_url),
       user:profiles(id, full_name, email, phone)`,
    )
    .eq('id', id)
    .single();

  if (!booking) notFound();

  const camera = booking.camera as {
    id: string;
    name: string;
    brand: string;
    type: string;
    price_per_day: number;
    image_url: string | null;
  } | null;

  const user = booking.user as {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
  } | null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/bookings"
          className="flex items-center gap-1 text-text-tertiary hover:text-primary font-text text-sm transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Kembali
        </Link>
        <h1 className="font-display text-2xl font-semibold text-text-dominant">Detail Booking</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking info */}
          <div className="bg-white rounded-2xl border border-black/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <h2 className="font-display text-lg font-semibold text-text-dominant">
                  Info Booking
                </h2>
              </div>
              <StatusBadge status={booking.status} />
            </div>
            <Row
              label="ID Booking"
              value={<span className="font-mono text-xs">{booking.id}</span>}
            />
            <Row label="Tanggal Mulai" value={booking.start_date} />
            <Row label="Tanggal Selesai" value={booking.end_date} />
            <Row label="Durasi" value={`${booking.duration} hari`} />
            <Row
              label="Dibuat"
              value={new Date(booking.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            />
            {booking.notes && <Row label="Catatan" value={booking.notes} />}
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl border border-black/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-semibold text-text-dominant">
                Rincian Biaya
              </h2>
            </div>
            <Row label="Harga Normal" value={formatCurrency(Number(booking.total_price))} />
            <Row
              label="Diskon"
              value={
                <span className={Number(booking.discount_amount) > 0 ? 'text-green-700' : ''}>
                  -{formatCurrency(Number(booking.discount_amount))}
                </span>
              }
            />
            <Row
              label="Total Bayar"
              value={
                <span className="text-primary text-base">
                  {formatCurrency(Number(booking.final_price))}
                </span>
              }
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Camera */}
          {camera && (
            <div className="bg-white rounded-2xl border border-black/10 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Camera className="h-5 w-5 text-primary" />
                <h2 className="font-display text-lg font-semibold text-text-dominant">Kamera</h2>
              </div>
              {camera.image_url && (
                <Image
                  src={camera.image_url}
                  alt={camera.name}
                  width={400}
                  height={160}
                  loading="lazy"
                  unoptimized
                  className="w-full h-40 object-cover rounded-xl mb-4 bg-surface-dark"
                />
              )}
              <Row label="Nama" value={camera.name} />
              <Row label="Brand" value={camera.brand} />
              <Row label="Tipe" value={camera.type} />
              <Row label="Harga/Hari" value={formatCurrency(camera.price_per_day)} />
            </div>
          )}

          {/* User */}
          {user && (
            <div className="bg-white rounded-2xl border border-black/10 p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-primary" />
                <h2 className="font-display text-lg font-semibold text-text-dominant">Penyewa</h2>
              </div>
              <Row label="Nama" value={user.full_name} />
              <Row label="Email" value={user.email} />
              {user.phone && <Row label="Telepon" value={user.phone} />}
            </div>
          )}

          {/* Update status */}
          <div className="bg-white rounded-2xl border border-black/10 p-6">
            <h2 className="font-display text-lg font-semibold mb-4 text-text-dominant">
              Update Status
            </h2>
            <StatusSelect bookingId={booking.id} current={booking.status as 'pending'} />
          </div>
        </div>
      </div>
    </div>
  );
}
