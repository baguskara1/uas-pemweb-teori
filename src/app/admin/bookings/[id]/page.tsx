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

  const isGroup = id.startsWith('group_');
  const actualId = isGroup ? id.replace('group_', '') : id;

  let query = supabase
    .from('bookings')
    .select(
      `id, status, start_date, end_date, duration, total_price, discount_amount, final_price, notes, created_at, order_group,
       camera:cameras(id, name, brand, type, price_per_day, image_url),
       user:profiles(id, full_name, email, phone)`,
    );

  if (isGroup) {
    query = query.eq('order_group', actualId);
  } else {
    query = query.eq('id', actualId);
  }

  const { data: bookings } = await query;
  if (!bookings || bookings.length === 0) notFound();

  const firstBooking = bookings[0];

  const user = firstBooking.user as {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
  } | null;

  const total_normal = bookings.reduce((sum, b) => sum + Number(b.total_price), 0);
  const total_discount = bookings.reduce((sum, b) => sum + Number(b.discount_amount), 0);
  const total_final = bookings.reduce((sum, b) => sum + Number(b.final_price), 0);

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
              <StatusBadge status={firstBooking.status} />
            </div>
            <Row
              label="ID Booking"
              value={<span className="font-mono text-xs">{id}</span>}
            />
            <Row label="Tanggal Mulai" value={firstBooking.start_date} />
            <Row label="Tanggal Selesai" value={firstBooking.end_date} />
            <Row label="Durasi" value={`${firstBooking.duration} hari`} />
            <Row
              label="Dibuat"
              value={new Date(firstBooking.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            />
            {firstBooking.notes && <Row label="Catatan" value={firstBooking.notes} />}
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl border border-black/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-semibold text-text-dominant">
                Rincian Biaya
              </h2>
            </div>
            <Row label="Harga Normal" value={formatCurrency(total_normal)} />
            <Row
              label="Diskon"
              value={
                <span className={total_discount > 0 ? 'text-green-700' : ''}>
                  -{formatCurrency(total_discount)}
                </span>
              }
            />
            <Row
              label="Total Bayar"
              value={
                <span className="text-primary text-base">
                  {formatCurrency(total_final)}
                </span>
              }
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Camera */}
          {/* Camera(s) */}
          <div className="bg-white rounded-2xl border border-black/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Camera className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-semibold text-text-dominant">
                {bookings.length > 1 ? `Kamera (${bookings.length} Item)` : 'Kamera'}
              </h2>
            </div>
            
            <div className="space-y-6">
              {bookings.map((b, idx) => {
                const cam: any = b.camera;
                if (!cam) return null;
                return (
                  <div key={b.id} className={idx > 0 ? 'pt-6 border-t border-black/10' : ''}>
                    {cam.image_url && (
                      <Image
                        src={cam.image_url}
                        alt={cam.name}
                        width={400}
                        height={160}
                        loading="lazy"
                        unoptimized
                        className="w-full h-40 object-cover rounded-xl mb-4 bg-surface-dark"
                      />
                    )}
                    <Row label="Nama" value={cam.name} />
                    <Row label="Brand" value={cam.brand} />
                    <Row label="Tipe" value={cam.type} />
                    <Row label="Harga/Hari" value={formatCurrency(cam.price_per_day)} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* User */}
          {user && (
            <div className="bg-white rounded-2xl border border-black/10 p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-primary" />
                <h2 className="font-display text-lg font-semibold text-text-dominant">Penyewa</h2>
              </div>
              <Row label="Nama" value={user.full_name} />
              <Row label="Email" value={user.email} />
              <div className="space-y-2 pt-1">
                <Row
                  label="Telepon"
                  value={user.phone || <span className="text-text-tertiary">Tidak tersedia</span>}
                />
                {user.phone ? (
                  (() => {
                    const rentedItems = bookings.map(b => (b.camera as any)?.name).filter(Boolean).join(', ');
                    const waText = `Halo ${user.full_name}, kami dari Sewa Kamera Ryox. Pembayaran Anda berupa ${rentedItems} telah kami terima. Silakan datang ke toko kami untuk pengambilan barang. Terima kasih.`;
                    
                    return (
                      <a
                        href={`https://wa.me/${user.phone.replace(/^0+/, '62').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waText)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-text text-sm font-semibold transition-colors"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WhatsApp Penyewa
                      </a>
                    );
                  })()
                ) : (
                  <p className="text-xs text-text-tertiary text-center py-1">
                    Nomor WhatsApp penyewa tidak tersedia
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Update status */}
          <div className="bg-white rounded-2xl border border-black/10 p-6">
            <h2 className="font-display text-lg font-semibold mb-4 text-text-dominant">
              Update Status
            </h2>
            <StatusSelect bookingId={id} current={firstBooking.status as 'pending'} />
          </div>
        </div>
      </div>
    </div>
  );
}
