import { HeroCamera } from '@/components/landing/HeroCamera';
import { createClient } from '@/lib/supabase/server';
import { ArrowRight, CalendarCheck, Camera, ShieldCheck, Sparkles, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    icon: Camera,
    title: 'Kamera Siap Produksi',
    description:
      'Mirrorless, DSLR, action cam, lensa, dan support gear terkurasi untuk kebutuhan konten harian sampai produksi serius.',
  },
  {
    icon: CalendarCheck,
    title: 'Booking Online Cepat',
    description: 'Pilih kamera, tanggal sewa, durasi, lalu lanjut checkout tanpa chat bolak-balik.',
  },
  {
    icon: ShieldCheck,
    title: 'Stok & Status Jelas',
    description:
      'Ketersediaan kamera dikelola langsung dari sistem supaya jadwal sewa lebih rapi dan transparan.',
  },
  {
    icon: Sparkles,
    title: 'Loyalty Rewards',
    description:
      'Sewa rutin jadi lebih hemat lewat kartu loyalti dan diskon otomatis setelah target tercapai.',
  },
];

const howItWorks = [
  {
    step: '01',
    title: 'Pilih Kamera',
    description: 'Jelajahi katalog, filter by tipe/brand, cek ketersediaan real-time.',
  },
  {
    step: '02',
    title: 'Tentukan Jadwal',
    description: 'Pilih tanggal ambil & kembalikan, durasi sewa otomatis hitung total biaya.',
  },
  {
    step: '03',
    title: 'Bayar & Konfirmasi',
    description: 'Bayar via Midtrans (VA, e-wallet, CC). Bukti pembayaran otomatis terverifikasi.',
  },
  {
    step: '04',
    title: 'Ambil & Produksi',
    description: 'Ambil unit di lokator atau kirim ke alamat. Unit bersih, siap pakai, lengkap aksesoris.',
  },
];

const testimonials = [
  {
    name: 'Nadia Putri',
    role: 'Content Creator',
    quote:
      'Butuh Sony A7 untuk campaign besok, proses booking cepat dan unitnya bersih. Hemat waktu banget.',
  },
  {
    name: 'Raka Pratama',
    role: 'Videographer',
    quote:
      'Pilihan kamera lengkap, harga harian jelas, dan dashboard bikin tracking sewa lebih gampang.',
  },
  {
    name: 'Maya Sari',
    role: 'Mahasiswa DKV',
    quote:
      'Pertama kali rental kamera online terasa aman karena stok, tanggal, dan total biaya kelihatan dari awal.',
  },
];

type CameraRow = {
  id: string;
  name: string;
  brand: string;
  type: string;
  price_per_day: number;
  image_url: string | null;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

async function getPopularCameras(): Promise<CameraRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('cameras')
    .select('id, name, brand, type, price_per_day, image_url')
    .eq('is_available', true)
    .order('created_at', { ascending: false })
    .limit(3);

  if (error) {
    console.error('Failed to fetch popular cameras', error.message);
    return [];
  }

  return data ?? [];
}

export default async function Home() {
  const popularCameras = await getPopularCameras();

  return (
    <div className="min-h-screen bg-[#161616] text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid min-h-[calc(100dvh-44px)] max-w-7xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-4 font-text text-sm font-semibold tracking-[0.18em] text-[#FDD26E] uppercase">
              Rental Kamera Premium
            </p>
            <h1 className="max-w-3xl font-display text-5xl font-semibold tracking-[-0.04em] leading-[1.04] md:text-7xl lg:text-8xl">
              Sewa kamera profesional <span className="text-[#FDD26E]">tanpa drama</span> operasional.
            </h1>
            <p className="mt-6 max-w-2xl font-text text-lg leading-8 text-white/70 md:text-xl">
              Pilih kamera, cek ketersediaan, booking online, lalu ambil unit siap produksi. Dibuat
              untuk kreator, videografer, dan tim kecil yang butuh gear cepat.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/cameras"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#FDD26E] px-8 font-text text-[#332A16] font-semibold transition-colors hover:bg-[#FED590] active:bg-[#FCC840]"
              >
                Jelajahi Kamera
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/register"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-white/20 px-8 font-text text-white/80 transition-colors hover:bg-white/5 hover:border-white/40"
              >
                Buat Akun Gratis
              </Link>
            </div>
            <div className="mt-12 grid max-w-lg grid-cols-3 divide-x divide-white/10 border-y border-white/10 py-6">
              <div>
                <p className="font-display text-3xl font-semibold text-white">10+</p>
                <p className="mt-1 font-text text-xs text-white/50">Unit siap sewa</p>
              </div>
              <div className="pl-5">
                <p className="font-display text-3xl font-semibold text-white">5</p>
                <p className="mt-1 font-text text-xs text-white/50">Sewa dapat diskon</p>
              </div>
              <div className="pl-5">
                <p className="font-display text-3xl font-semibold text-[#FDD26E]">15%</p>
                <p className="mt-1 font-text text-xs text-white/50">Loyalty reward</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <HeroCamera />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-t border-white/10 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-text text-sm font-semibold tracking-[0.16em] text-[#FDD26E] uppercase">
              Cara Kerja
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.03em] md:text-5xl lg:text-6xl">
              Workflow rental yang ringkas dari pilih sampai bayar.
            </h2>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step) => (
              <article
                key={step.step}
                className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:border-white/20 hover:bg-white/10"
              >
                <span className="font-display text-4xl font-semibold text-[#FDD26E]/30">{step.step}</span>
                <h3 className="mt-4 font-display text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-3 font-text leading-7 text-white/60">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-white/10 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-text text-sm font-semibold tracking-[0.16em] text-[#FDD26E] uppercase">
              Fitur Utama
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.03em] md:text-5xl lg:text-6xl">
              Semua yang butuh untuk produksi lancar.
            </h2>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:border-white/20 hover:bg-white/10"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FDD26E]/10 flex items-center justify-center">
                  <feature.icon className="h-7 w-7 text-[#FDD26E]" />
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 font-text leading-7 text-white/60">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Cameras Section */}
      <section className="border-t border-white/10 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="font-text text-sm font-semibold tracking-[0.16em] text-[#FDD26E] uppercase">
                Kamera Populer
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.03em] md:text-5xl lg:text-6xl">
                Unit favorit untuk produksi minggu ini.
              </h2>
            </div>
            <Link
              href="/cameras"
              className="font-text font-semibold text-white/70 hover:text-[#FDD26E] transition-colors flex items-center gap-1"
            >
              Lihat semua kamera
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {popularCameras.length > 0 ? (
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {popularCameras.map((camera) => (
                <Link
                  key={camera.id}
                  href={`/cameras/${camera.id}`}
                  className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                >
                  <div className="relative aspect-[4/3] w-full bg-white/5 overflow-hidden">
                    {camera.image_url ? (
                      <Image
                        src={camera.image_url}
                        alt={camera.name}
                        width={800}
                        height={600}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                        unoptimized
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="grid h-full place-items-center bg-gradient-to-br from-white/5 to-transparent">
                        <Camera className="h-16 w-16 text-[#FDD26E]/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6">
                    <p className="font-text text-sm text-white/50 uppercase tracking-wider">
                      {camera.brand} · {camera.type}
                    </p>
                    <h3 className="mt-2 font-display text-xl font-semibold text-white group-hover:text-[#FDD26E] transition-colors line-clamp-1">
                      {camera.name}
                    </h3>
                    <p className="mt-4 font-text font-semibold text-[#FDD26E]">
                      {formatCurrency(camera.price_per_day)}
                      <span className="text-sm font-normal text-white/50"> / hari</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-12 border border-white/10 bg-white/5 rounded-2xl p-10 text-center">
              <Camera className="mx-auto h-12 w-12 text-white/30" />
              <h3 className="mt-4 font-display text-2xl font-semibold text-white">Kamera belum tersedia</h3>
              <p className="mt-2 font-text text-white/50">
                Data kamera dari Supabase kosong atau belum bisa diakses.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="border-t border-white/10 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-text text-sm font-semibold tracking-[0.16em] text-[#FDD26E] uppercase">
              Testimoni
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.03em] md:text-5xl lg:text-6xl">
              Dipakai kreator yang butuh gear cepat dan jelas.
            </h2>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <figure
                key={testimonial.name}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:border-white/20 hover:bg-white/10"
              >
                <div className="flex gap-1 text-[#FDD26E]" aria-label="Rating 5 dari 5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={`${testimonial.name}-${index}`} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-6 font-text text-lg leading-8 text-white/80">
                  "{testimonial.quote}"
                </blockquote>
                <figcaption className="mt-6">
                  <p className="font-display text-lg font-semibold text-white">{testimonial.name}</p>
                  <p className="font-text text-sm text-white/50">{testimonial.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-white/10 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl px-6 py-16 text-center md:px-12 md:py-24">
            <p className="font-text text-sm font-semibold tracking-[0.16em] text-[#FDD26E] uppercase">
              Siap Produksi
            </p>
            <h2 className="mx-auto mt-3 max-w-3xl font-display text-4xl font-semibold tracking-[-0.03em] md:text-6xl lg:text-7xl">
              Booking kamera pertama Anda hari ini.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl font-text text-lg leading-8 text-white/70">
              Mulai dari katalog, pilih tanggal, lalu lanjut ke proses booking. Semua rapi dalam satu
              sistem.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row justify-center">
              <Link
                href="/cameras"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#FDD26E] px-8 font-text text-[#332A16] font-semibold transition-colors hover:bg-[#FED590] active:bg-[#FCC840]"
              >
                Mulai Sewa Sekarang
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/register"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-white/20 px-8 font-text text-white/80 transition-colors hover:bg-white/5 hover:border-white/40"
              >
                Buat Akun Gratis
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}