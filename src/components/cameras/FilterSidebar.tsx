'use client';

import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

type FilterSidebarProps = {
  brands: string[];
  types: string[];
};

export function FilterSidebar({ brands, types }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(searchParams.getAll('brand'));
  const [selectedTypes, setSelectedTypes] = useState<string[]>(searchParams.getAll('type'));
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();

    if (search) params.set('q', search);
    selectedBrands.forEach((b) => params.append('brand', b));
    selectedTypes.forEach((t) => params.append('type', t));
    if (minPrice) params.set('min_price', minPrice);
    if (maxPrice) params.set('max_price', maxPrice);

    router.push(`/cameras?${params.toString()}`, { scroll: false });
  }, [search, selectedBrands, selectedTypes, minPrice, maxPrice, router]);

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedBrands([]);
    setSelectedTypes([]);
    setMinPrice('');
    setMaxPrice('');
    router.push('/cameras');
  };

  // Sync state with URL params on back/forward
  useEffect(() => {
    setSearch(searchParams.get('q') || '');
    setSelectedBrands(searchParams.getAll('brand'));
    setSelectedTypes(searchParams.getAll('type'));
    setMinPrice(searchParams.get('min_price') || '');
    setMaxPrice(searchParams.get('max_price') || '');
  }, [searchParams]);

  return (
    <div className="flex flex-col gap-8">
      {/* Search */}
      <div>
        <label htmlFor="search" className="sr-only">
          Cari kamera
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-text-tertiary" />
          </div>
          <input
            type="text"
            id="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            className="block w-full rounded-input border border-surface-light bg-white py-2 pl-10 pr-3 font-text text-sm placeholder:text-text-tertiary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Cari model kamera..."
          />
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-display text-sm font-semibold text-text-dominant uppercase tracking-wider mb-4">
          Merek
        </h3>
        <div className="space-y-3">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => handleBrandChange(brand)}
                className="h-4 w-4 rounded border-surface-light text-primary focus:ring-primary"
              />
              <span className="font-text text-sm text-text-secondary">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Types */}
      <div>
        <h3 className="font-display text-sm font-semibold text-text-dominant uppercase tracking-wider mb-4">
          Kategori
        </h3>
        <div className="space-y-3">
          {types.map((type) => (
            <label key={type} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => handleTypeChange(type)}
                className="h-4 w-4 rounded border-surface-light text-primary focus:ring-primary"
              />
              <span className="font-text text-sm text-text-secondary">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-display text-sm font-semibold text-text-dominant uppercase tracking-wider mb-4">
          Harga (per hari)
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            className="w-full rounded-input border border-surface-light px-3 py-2 font-text text-sm focus:border-primary focus:outline-none"
          />
          <span className="text-text-tertiary">-</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            className="w-full rounded-input border border-surface-light px-3 py-2 font-text text-sm focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 pt-4 border-t border-surface-light">
        <button
          onClick={applyFilters}
          className="w-full h-touch bg-primary hover:bg-primary-hover active:bg-primary-press text-white font-text rounded-button transition-colors"
        >
          Terapkan Filter
        </button>
        {(search ||
          selectedBrands.length > 0 ||
          selectedTypes.length > 0 ||
          minPrice ||
          maxPrice) && (
          <button
            onClick={clearFilters}
            className="flex items-center justify-center gap-2 w-full py-2 text-sm font-text text-text-tertiary hover:text-text-dominant transition-colors"
          >
            <X className="w-4 h-4" />
            Hapus Filter
          </button>
        )}
      </div>
    </div>
  );
}
