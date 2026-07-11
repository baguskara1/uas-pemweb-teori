'use client';
import { Search, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { HeroCamera } from './HeroCamera';

export function HeroSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/cameras?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-40 pointer-events-none" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kini Dilengkapi Assisten Pribadi Ryoxi</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-semibold tracking-[-0.04em] leading-none">
              Sewa Kamera Instan <span className="text-primary">Untuk Hasil Sinematik</span>
            </h1>

            <p className="text-base sm:text-lg text-black/60 max-w-xl mx-auto lg:mx-0">
              Sewa perangkat kamera profesional secara online. Tanpa proses berbelit-belit, jaminan
              alat steril, dan stok terjamin.
            </p>

            <div className="max-w-md mx-auto lg:mx-0 pt-2">
              <div className="p-1.5 rounded-2xl flex items-center gap-2 border border-black/10 bg-white shadow-lg focus-within:ring-2 focus-within:ring-primary/40">
                <div className="pl-3 text-text-tertiary">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Cari kamera Sony, Canon, Lensa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="bg-transparent border-0 outline-none w-full text-sm py-2"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-text font-semibold text-xs uppercase tracking-wider transition-all"
                >
                  Temukan
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 max-w-md mx-auto lg:mx-0">
              <div>
                <div className="text-2xl font-display font-semibold text-primary">100%</div>
                <div className="text-xs text-text-tertiary font-medium">Alat Terawat</div>
              </div>
              <div>
                <div className="text-2xl font-display font-semibold text-primary">24 Jam</div>
                <div className="text-xs text-text-tertiary font-medium">Batal Gratis</div>
              </div>
              <div>
                <div className="text-2xl font-display font-semibold text-primary">15% Off</div>
                <div className="text-xs text-text-tertiary font-medium">Sewa Kelima</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <HeroCamera />
          </div>
        </div>
      </div>
    </section>
  );
}
