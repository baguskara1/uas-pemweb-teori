import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { CameraCard } from '@/components/cameras/CameraCard';
import { CamerasRealtimeProvider } from '@/components/cameras/CamerasRealtimeProvider';
import { FilterSidebar } from '@/components/cameras/FilterSidebar';
import { MobileFilterToggle } from '@/components/cameras/MobileFilterToggle';
import { createClient } from '@/lib/supabase/server';

type SearchParams = Promise<{
  q?: string;
  brand?: string | string[];
  type?: string | string[];
  category?: string;
  min_price?: string;
  max_price?: string;
  page?: string;
}>;

const ITEMS_PER_PAGE = 6;

export default async function CamerasPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;

  const searchQuery = searchParams.q || '';
  const brandParams = searchParams.brand
    ? Array.isArray(searchParams.brand)
      ? searchParams.brand
      : [searchParams.brand]
    : [];
  const typeParams = searchParams.type
    ? Array.isArray(searchParams.type)
      ? searchParams.type
      : [searchParams.type]
    : [];
  const category = searchParams.category || '';
  const minPrice = searchParams.min_price ? Number.parseInt(searchParams.min_price, 10) : null;
  const maxPrice = searchParams.max_price ? Number.parseInt(searchParams.max_price, 10) : null;
  const currentPage = searchParams.page ? Number.parseInt(searchParams.page, 10) : 1;

  const supabase = await createClient();

  // Fetch unique brands and types for sidebar filters
  const { data: allCamerasForMeta } = await supabase
    .from('cameras')
    .select('brand, type')
    .eq('is_available', true);

  const brands = Array.from(new Set(allCamerasForMeta?.map((c) => c.brand) || [])).sort();
  const types = Array.from(new Set(allCamerasForMeta?.map((c) => c.type) || [])).sort();

  // Build query
  let query = supabase
    .from('cameras')
    .select('id, name, brand, type, category, price_per_day, image_url, is_available, stock', {
      count: 'exact',
    })
    .eq('is_available', true);

  if (category) {
    query = query.eq('category', category);
  }
  if (searchQuery) {
    query = query.ilike('name', `%${searchQuery}%`);
  }
  if (brandParams.length > 0) {
    query = query.in('brand', brandParams);
  }
  if (typeParams.length > 0) {
    query = query.in('type', typeParams);
  }
  if (minPrice !== null) {
    query = query.gte('price_per_day', minPrice);
  }
  if (maxPrice !== null) {
    query = query.lte('price_per_day', maxPrice);
  }

  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const { data: cameras, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 1;

  const buildPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    brandParams.forEach((b) => params.append('brand', b));
    typeParams.forEach((t) => params.append('type', t));
    if (category) params.set('category', category);
    if (minPrice !== null) params.set('min_price', minPrice.toString());
    if (maxPrice !== null) params.set('max_price', maxPrice.toString());
    params.set('page', pageNumber.toString());
    return `/cameras?${params.toString()}`;
  };

  return (
    <CamerasRealtimeProvider>
      <div className="bg-white min-h-screen text-text-dominant pt-16">
        <div className="mx-auto max-w-container px-4 py-12 sm:px-6 lg:px-8">
          <header className="mb-12">
            <p className="font-text text-sm font-semibold tracking-[0.18em] text-primary uppercase mb-2">
              Katalog Sewa
            </p>
            <h1 className="font-display text-4xl font-semibold tracking-[-0.03em] md:text-5xl text-text-dominant">
              Pilih Gear Produksi Anda.
            </h1>
            <p className="mt-4 font-text text-black/60 max-w-xl">
              Semua kamera siap digunakan dengan kondisi bersih, baterai penuh, dan aksesoris bawaan
              lengkap.
            </p>
          </header>

          {/* Mobile filter toggle */}
          <div className="mb-6">
            <MobileFilterToggle brands={brands} types={types} defaultCategory={category} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 lg:gap-10 items-start">
            {/* Sidebar — hidden on mobile */}
            <aside className="hidden lg:block lg:sticky lg:top-24">
              <FilterSidebar brands={brands} types={types} defaultCategory={category} />
            </aside>

            {/* Main Grid */}
            <main>
              {cameras && cameras.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cameras.map((camera) => (
                      <CameraCard key={camera.id} camera={camera} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <nav className="flex items-center justify-between border-t border-surface-light mt-12 pt-6">
                      <div className="flex-1 flex justify-between sm:hidden">
                        {currentPage > 1 ? (
                          <Link
                            href={buildPageUrl(currentPage - 1)}
                            className="inline-flex items-center justify-center min-h-touch px-4 border border-surface-light text-sm font-text rounded-button hover:bg-surface-light/5 transition-colors"
                          >
                            Sebelumnya
                          </Link>
                        ) : (
                          <div className="w-1" />
                        )}
                        {currentPage < totalPages ? (
                          <Link
                            href={buildPageUrl(currentPage + 1)}
                            className="inline-flex items-center justify-center min-h-touch px-4 border border-surface-light text-sm font-text rounded-button hover:bg-surface-light/5 transition-colors"
                          >
                            Selanjutnya
                          </Link>
                        ) : (
                          <div className="w-1" />
                        )}
                      </div>
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-text text-text-tertiary">
                            Menampilkan{' '}
                            <span className="font-semibold text-text-dominant">{from + 1}</span>{' '}
                            sampai{' '}
                            <span className="font-semibold text-text-dominant">
                              {Math.min(to + 1, count || 0)}
                            </span>{' '}
                            dari <span className="font-semibold text-text-dominant">{count}</span>{' '}
                            kamera
                          </p>
                        </div>
                        <div>
                          <ul className="flex items-center gap-1">
                            {currentPage > 1 && (
                              <li>
                                <Link
                                  href={buildPageUrl(currentPage - 1)}
                                  className="grid place-items-center h-touch w-10 border border-black/10 rounded-full text-black/60 hover:border-primary hover:text-primary transition-colors"
                                >
                                  <ChevronLeft className="w-4 h-4" />
                                </Link>
                              </li>
                            )}
                            {Array.from({ length: totalPages }).map((_, idx) => {
                              const pageNum = idx + 1;
                              return (
                                <li key={pageNum}>
                                  <Link
                                    href={buildPageUrl(pageNum)}
                                    className={`grid place-items-center h-touch w-10 rounded-full font-text text-sm transition-colors ${
                                      currentPage === pageNum
                                        ? 'bg-primary text-white font-semibold'
                                        : 'border border-black/10 text-black/60 hover:border-primary hover:text-primary'
                                    }`}
                                  >
                                    {pageNum}
                                  </Link>
                                </li>
                              );
                            })}
                            {currentPage < totalPages && (
                              <li>
                                <Link
                                  href={buildPageUrl(currentPage + 1)}
                                  className="grid place-items-center h-touch w-10 border border-black/10 rounded-full text-black/60 hover:border-primary hover:text-primary transition-colors"
                                >
                                  <ChevronRight className="w-4 h-4" />
                                </Link>
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </nav>
                  )}
                </>
              ) : (
                <div className="border border-dashed border-black/15 p-16 text-center bg-surface-dark rounded-2xl">
                  <h3 className="font-display text-2xl font-semibold mb-2 text-text-dominant">
                    Kamera tidak ditemukan
                  </h3>
                  <p className="font-text text-black/40 max-w-sm mx-auto">
                    Coba kurangi filter atau cari kata kunci lain untuk menemukan kamera yang Anda
                    cari.
                  </p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </CamerasRealtimeProvider>
  );
}
