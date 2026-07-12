import { Calendar, Camera, CheckCircle2, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function CameraDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  const supabase = await createClient();

  const { data: camera, error } = await supabase
    .from('cameras')
    .select(
      'id, name, brand, type, category, description, price_per_day, stock, is_available, image_url',
    )
    .eq('id', id)
    .single();

  if (error || !camera) {
    notFound();
  }

  const formatCurrency = (value: number) => `Rp ${Math.round(value).toLocaleString('id-ID')}`;

  const isAvailable = camera.is_available && camera.stock > 0;

  return (
    <div className="bg-white min-h-screen pt-16 pb-24">
      <div className="mx-auto max-w-container px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back Navigation */}
        <nav className="mb-8">
          <Link
            href="/cameras"
            className="inline-flex items-center gap-2 font-text text-sm text-text-tertiary hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali ke Katalog
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-16 items-start">
          {/* Image Gallery (Simplified to single large image for now per schema, can expand later) */}
          <div className="bg-surface-light rounded-[2rem] overflow-hidden aspect-[4/3] w-full relative">
            {camera.image_url ? (
              <Image
                src={camera.image_url}
                alt={camera.name}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center bg-gradient-to-br from-white to-surface-light">
                <Camera className="w-24 h-24 text-primary/40" />
              </div>
            )}
          </div>

          {/* Details & Pricing */}
          <div className="flex flex-col">
            <div className="mb-6">
              <p className="font-text text-sm font-semibold tracking-wider text-text-tertiary uppercase mb-2">
                {camera.brand} · {camera.type}
              </p>
              <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-[-0.03em] text-text-dominant leading-tight">
                {camera.name}
              </h1>
            </div>

            <div className="mb-8">
              <p className="font-display text-3xl font-semibold text-primary">
                {formatCurrency(camera.price_per_day)}
                <span className="font-text text-base font-normal text-text-tertiary ml-2">
                  / hari
                </span>
              </p>
            </div>

            {/* Description */}
            <div className="mb-10">
              <h3 className="font-display text-xl font-semibold mb-3">Deskripsi</h3>
              <p className="font-text text-lg leading-relaxed text-text-secondary whitespace-pre-wrap">
                {camera.description || 'Tidak ada deskripsi tersedia untuk kamera ini.'}
              </p>
            </div>

            {/* Availability Check */}
            <div className="mb-10 p-6 rounded-2xl border border-surface-light bg-white shadow-sm">
              <h3 className="font-display text-lg font-semibold mb-4">Status Ketersediaan</h3>
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    isAvailable ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  {isAvailable ? (
                    <CheckCircle2 className="w-5 h-5 text-green-700" />
                  ) : (
                    <div className="w-5 h-5 text-red-700 font-bold flex items-center justify-center">
                      !
                    </div>
                  )}
                </div>
                <div>
                  <p
                    className={`font-display text-lg font-semibold ${isAvailable ? 'text-green-700' : 'text-red-700'}`}
                  >
                    {isAvailable ? 'Tersedia' : 'Sedang Habis'}
                  </p>
                  <p className="font-text text-sm text-text-tertiary mt-1">
                    {isAvailable
                      ? `${camera.stock} unit siap disewa`
                      : 'Unit sedang tidak tersedia saat ini'}
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Trigger */}
            <div className="mt-auto">
              {isAvailable ? (
                <Link
                  href={`/checkout/${camera.id}`}
                  className="flex items-center justify-center w-full h-14 bg-primary hover:bg-primary-hover active:bg-primary-press text-white font-text text-lg font-semibold rounded-full transition-colors gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Sewa {camera.category === 'camera' ? 'Kamera' : camera.category === 'lens' ? 'Lensa' : camera.type} Ini
                </Link>
              ) : (
                <button
                  disabled
                  className="flex items-center justify-center w-full h-14 bg-surface-light text-text-tertiary font-text text-lg font-semibold rounded-full cursor-not-allowed"
                >
                  Kamera Habis
                </button>
              )}
              <p className="text-center font-text text-xs text-text-tertiary mt-4">
                Booking sekarang, bayar setelah konfirmasi ketersediaan tanggal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
