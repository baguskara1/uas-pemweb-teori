'use client';
import { Camera, ChevronDown, ChevronLeft, ChevronRight, Heart, Search } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useToast } from '@/components/shared/Toast';
import { useAuth } from '@/contexts/AuthContext';
import { addToWishlist, removeFromWishlist } from '@/lib/wishlist';
import { CameraDetailModal } from './CameraDetailModal';

type CameraRow = {
  id: string;
  name: string;
  brand: string;
  type: string;
  category: string;
  price_per_day: number;
  image_url: string | null;
  is_available: boolean;
  stock: number;
};

type CatalogSectionProps = {
  initialCameras: CameraRow[];
  brands: string[];
  types: string[];
};

const ITEMS_PER_PAGE = 6;

export function CatalogSection({ initialCameras, brands, types }: CatalogSectionProps) {
  const { user } = useAuth();
  const { show } = useToast();
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedProductCategory, setSelectedProductCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState(2000000);
  const [page, setPage] = useState(1);
  const [wishlisted, setWishlisted] = useState<string[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<CameraRow | null>(null);

  useEffect(() => {
    if (user) {
      fetch('/api/wishlist')
        .then((r) => r.json())
        .then((d) => {
          if (d.data) setWishlisted(d.data.map((i: { camera_id: string }) => i.camera_id));
        });
    }
  }, [user]);

  const filtered = useMemo(() => {
    let list = [...initialCameras];
    if (selectedProductCategory !== 'all')
      list = list.filter((c) => c.category === selectedProductCategory);
    if (search)
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.brand.toLowerCase().includes(search.toLowerCase()),
      );
    if (selectedBrand !== 'All') list = list.filter((c) => c.brand === selectedBrand);
    if (selectedType !== 'All') list = list.filter((c) => c.type === selectedType);
    list = list.filter((c) => c.price_per_day <= priceRange);
    if (sortBy === 'popular') list.sort((a, b) => b.stock - a.stock);
    else if (sortBy === 'price-low') list.sort((a, b) => a.price_per_day - b.price_per_day);
    else if (sortBy === 'price-high') list.sort((a, b) => b.price_per_day - a.price_per_day);
    return list;
  }, [
    initialCameras,
    search,
    selectedBrand,
    selectedType,
    selectedProductCategory,
    sortBy,
    priceRange,
  ]);

  const formatCurrency = (v: number) => `Rp ${Math.round(v).toLocaleString('id-ID')}`;

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleWishlist = async (cameraId: string) => {
    if (!user) {
      show('Login dulu untuk wishlist', 'info');
      return;
    }
    if (wishlisted.includes(cameraId)) {
      await removeFromWishlist(cameraId);
      setWishlisted((w) => w.filter((id) => id !== cameraId));
      show('Dihapus dari Wishlist', 'info');
    } else {
      await addToWishlist(cameraId);
      setWishlisted((w) => [...w, cameraId]);
      show('Ditambahkan ke Wishlist', 'success');
    }
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedBrand('All');
    setSelectedType('All');
    setSelectedProductCategory('all');
    setSortBy('popular');
    setPriceRange(2000000);
    setPage(1);
  };

  return (
    <section id="catalog-section" className="py-20 border-t border-black/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.03em]">
            Katalog Kamera & Aksesoris
          </h2>
          <p className="text-black/60 text-sm">
            Gunakan filter untuk menyaring kamera terbaik sesuai kebutuhan Anda.
          </p>
        </div>

        <div className="p-6 rounded-3xl border border-black/10 bg-white mb-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Cari berdasarkan tipe, spesifikasi..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-black/15 bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            <div className="md:col-span-3 relative">
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-black/15 bg-white focus:border-primary outline-none appearance-none text-text-secondary"
              >
                <option value="All" className="text-text-secondary">
                  Semua Merek
                </option>
                {brands.map((b) => (
                  <option key={b} value={b} className="text-text-secondary">
                    {b}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
            </div>
            <div className="md:col-span-4 relative">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-black/15 bg-white focus:border-primary outline-none appearance-none"
              >
                <option value="popular">Tingkat Kepopuleran</option>
                <option value="price-low">Harga: Rendah ke Tinggi</option>
                <option value="price-high">Harga: Tinggi ke Rendah</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mr-2">
              Produk:
            </span>
            {[
              { value: 'all', label: 'Semua' },
              { value: 'camera', label: 'Kamera' },
              { value: 'lens', label: 'Lensa' },
              { value: 'accessory', label: 'Aksesoris' },
            ].map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => {
                  setSelectedProductCategory(cat.value);
                  setPage(1);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedProductCategory === cat.value
                    ? 'bg-primary text-white shadow'
                    : 'bg-surface-dark text-text-secondary hover:text-primary hover:bg-primary/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-black/10">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mr-2">
              Tipe:
            </span>
            {['All', ...types].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setSelectedType(t);
                  setPage(1);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedType === t
                    ? 'bg-primary text-white shadow'
                    : 'bg-surface-dark text-text-secondary hover:text-primary hover:bg-primary/10'
                }`}
              >
                {t === 'All' ? 'Semua' : t}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex-1">
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-text-tertiary">Harga Harian Maksimal</span>
                <span className="text-primary">Rp {priceRange.toLocaleString('id-ID')}</span>
              </div>
              <input
                type="range"
                min={200000}
                max={2000000}
                step={50000}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer h-1.5 bg-surface-dark rounded-lg appearance-none"
              />
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-text-tertiary hover:text-primary font-semibold self-end sm:self-auto transition-colors"
            >
              Reset Semua Filter
            </button>
          </div>
        </div>

        {paginated.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginated.map((camera) => (
                <div
                  key={camera.id}
                  onClick={() => setSelectedCamera(camera)}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedCamera(camera)}
                  className="group rounded-2xl border border-black/10 bg-white overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-black/20"
                >
                  <div className="relative aspect-[4/3] bg-surface-dark overflow-hidden">
                    {camera.image_url ? (
                      <Image
                        src={camera.image_url}
                        alt={camera.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-contain"
                      />
                    ) : (
                      <div className="grid h-full place-items-center">
                        <Camera className="w-12 h-12 text-primary/40" />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-black/80 text-primary text-[10px] font-semibold px-2.5 py-1 rounded-md uppercase">
                      {camera.brand}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWishlist(camera.id);
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm shadow transition-all ${
                        wishlisted.includes(camera.id)
                          ? 'bg-primary text-white'
                          : 'bg-black/50 hover:bg-black/80 text-white'
                      }`}
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-text-tertiary font-semibold">
                        {camera.type}
                      </span>
                      <h3 className="font-display text-base font-semibold group-hover:text-primary transition-colors line-clamp-1">
                        {camera.name}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-black/10">
                      <div>
                        <p className="font-text font-semibold text-primary">
                          {formatCurrency(camera.price_per_day)}
                          <span className="text-xs font-normal text-text-tertiary"> / hari</span>
                        </p>
                      </div>
                      <span className="px-3 py-1 text-[11px] font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {camera.is_available ? 'Tersedia' : 'Habis'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <nav className="flex items-center justify-center gap-2 mt-12">
                {page > 1 && (
                  <button
                    type="button"
                    onClick={() => setPage((p) => p - 1)}
                    className="grid place-items-center h-touch w-10 border border-black/10 rounded-full text-text-tertiary hover:border-primary hover:text-primary transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pg) => (
                  <button
                    key={pg}
                    type="button"
                    onClick={() => setPage(pg)}
                    className={`grid place-items-center h-touch w-10 rounded-full font-text text-sm transition-colors ${
                      page === pg
                        ? 'bg-primary text-white font-semibold'
                        : 'border border-black/10 text-text-tertiary hover:border-primary hover:text-primary'
                    }`}
                  >
                    {pg}
                  </button>
                ))}
                {page < totalPages && (
                  <button
                    type="button"
                    onClick={() => setPage((p) => p + 1)}
                    className="grid place-items-center h-touch w-10 border border-black/10 rounded-full text-text-tertiary hover:border-primary hover:text-primary transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </nav>
            )}
          </>
        ) : (
          <div className="p-16 rounded-3xl text-center border border-dashed border-black/10 bg-surface-dark space-y-6">
            <Camera className="w-12 h-12 text-black/20 mx-auto" />
            <h3 className="font-display text-xl font-semibold">Kamera Tidak Ditemukan</h3>
            <p className="text-sm text-text-tertiary max-w-md mx-auto">
              Coba kurangi filter atau cari kata kunci lain.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-6 py-3 rounded-full bg-primary hover:bg-primary-hover text-white font-text font-semibold text-xs uppercase tracking-wider transition-all"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {selectedCamera && (
        <CameraDetailModal camera={selectedCamera} onClose={() => setSelectedCamera(null)} />
      )}
    </section>
  );
}
