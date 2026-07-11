import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-24 bg-zinc-900 text-white border-t border-zinc-800">
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent pointer-events-none" />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Penawaran Terbatas Bulan Ini</span>
        </div>
        <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-[-0.03em] leading-none">
          Siap Memulai Produksi Kreatif Anda?
        </h2>
        <p className="text-zinc-400 text-sm max-w-2xl mx-auto">
          Booking sekarang dan dapatkan pengalaman rental kamera profesional tanpa drama
          operasional.
        </p>
        <div className="pt-4">
          <Link
            href="/cameras"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-zinc-950 font-text font-semibold hover:bg-primary hover:text-white transition-all duration-300 text-sm"
          >
            Cari Kamera Sekarang
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
