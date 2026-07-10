import { BookingForm } from '@/components/booking/BookingForm';
import { createClient } from '@/lib/supabase/server';
import { Camera, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function CheckoutPage(props: { params: Promise<{ cameraId: string }> }) {
  const params = await props.params;
  const { cameraId } = params;

  const supabase = await createClient();

  const { data: camera, error } = await supabase
    .from('cameras')
    .select('*')
    .eq('id', cameraId)
    .single();

  if (error || !camera) {
    notFound();
  }

  if (!camera.is_available || camera.stock <= 0) {
    return (
      <div className="min-h-screen pt-24 bg-white">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8 text-center py-20">
          <h1 className="font-display text-3xl font-semibold mb-3">Kamera Tidak Tersedia</h1>
          <p className="font-text text-text-tertiary mb-8">
            Unit ini sedang tidak bisa dibooking saat ini.
          </p>
          <Link
            href="/cameras"
            className="inline-flex items-center gap-2 px-6 h-12 bg-primary text-white rounded-full font-text font-semibold hover:bg-primary-hover transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Cari Kamera Lain
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-16 pb-24">
      <div className="mx-auto max-w-container px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-8">
          <Link
            href={`/cameras/${camera.id}`}
            className="inline-flex items-center gap-2 font-text text-sm text-text-tertiary hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali ke Detail
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 items-start">
          {/* Order Summary */}
          <aside className="bg-surface-light/30 border border-surface-light rounded-3xl p-8 lg:sticky lg:top-24">
            <h2 className="font-display text-xl font-semibold mb-6">Detail Pesanan</h2>
            <div className="flex gap-4 mb-6">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white shrink-0 border border-surface-light">
                {camera.image_url ? (
                  <img
                    src={camera.image_url}
                    alt={camera.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center">
                    <Camera className="w-6 h-6 text-primary" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-text text-xs text-text-tertiary uppercase tracking-wider">
                  {camera.brand}
                </p>
                <h3 className="font-display text-lg font-semibold leading-tight">{camera.name}</h3>
                <p className="font-text text-xs text-text-tertiary mt-1">{camera.type}</p>
              </div>
            </div>

            <ul className="space-y-3 font-text text-sm text-text-secondary border-t border-surface-light pt-6">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>
                  Booking disimpan dengan status <strong>pending</strong> sampai diverifikasi.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Biaya dihitung otomatis dari jumlah hari sewa × harga harian.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Pembayaran dilakukan setelah konfirmasi jadwal dari tim kami.</span>
              </li>
            </ul>
          </aside>

          {/* Form */}
          <main>
            <header className="mb-8">
              <p className="font-text text-sm font-semibold tracking-wider text-primary uppercase mb-2">
                Booking
              </p>
              <h1 className="font-display text-4xl font-semibold tracking-[-0.03em]">
                Atur Jadwal Sewa
              </h1>
            </header>

            <BookingForm camera={camera} />
          </main>
        </div>
      </div>
    </div>
  );
}
