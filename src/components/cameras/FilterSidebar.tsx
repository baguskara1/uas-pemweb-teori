'use client';

import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { CATEGORY_OPTIONS } from '@/lib/constants';

type FilterSidebarProps = {
  brands: string[];
  types: string[];
  defaultCategory?: string;
};

export function FilterSidebar({ brands, types, defaultCategory = '' }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(() => searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get('category') || defaultCategory);
  const [selectedBrands, setSelectedBrands] = useState(() => searchParams.getAll('brand'));
  const [selectedTypes, setSelectedTypes] = useState(() => searchParams.getAll('type'));
  const [minPrice, setMinPrice] = useState(() => searchParams.get('min_price') || '');
  const [maxPrice, setMaxPrice] = useState(() => searchParams.get('max_price') || '');

  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const pushWith = (
    search: string,
    category: string,
    brands: string[],
    types: string[],
    min: string,
    max: string,
  ) => {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (category) params.set('category', category);
    brands.forEach((b) => params.append('brand', b));
    types.forEach((t) => params.append('type', t));
    if (min) params.set('min_price', min);
    if (max) params.set('max_price', max);
    router.push(`/cameras?${params.toString()}`, { scroll: false });
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    pushWith(search, cat, selectedBrands, selectedTypes, minPrice, maxPrice);
  };

  const handleBrandChange = (brand: string) => {
    const next = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(next);
    pushWith(search, selectedCategory, next, selectedTypes, minPrice, maxPrice);
  };

  const handleTypeChange = (type: string) => {
    const next = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(next);
    pushWith(search, selectedCategory, selectedBrands, next, minPrice, maxPrice);
  };

  const handlePriceSearchChange = (nextSearch: string, nextMin: string, nextMax: string) => {
    setSearch(nextSearch);
    setMinPrice(nextMin);
    setMaxPrice(nextMax);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      pushWith(nextSearch, selectedCategory, selectedBrands, selectedTypes, nextMin, nextMax);
    }, 400);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedBrands([]);
    setSelectedTypes([]);
    setMinPrice('');
    setMaxPrice('');
    router.push('/cameras');
  };

  return (
    <div className="flex flex-col gap-8 bg-white border border-black/10 p-6 rounded-2xl">
      <div>
        <label htmlFor="search" className="sr-only">
          Cari produk
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-text-tertiary" />
          </div>
          <input
            type="text"
            id="search"
            value={search}
            onChange={(e) => {
              handlePriceSearchChange(e.target.value, minPrice, maxPrice);
            }}
            className="block w-full rounded-xl border border-black/15 bg-white py-2 pl-10 pr-3 font-text text-sm text-text-dominant placeholder:text-text-tertiary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Cari model kamera..."
          />
        </div>
      </div>

      <div>
        <h3 className="font-display text-sm font-semibold text-primary uppercase tracking-wider mb-3">
          Produk
        </h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleCategoryChange(opt.value)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === opt.value
                  ? 'bg-primary text-white'
                  : 'bg-surface-dark text-text-secondary hover:text-primary hover:bg-primary/10'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display text-sm font-semibold text-primary uppercase tracking-wider mb-4">
          Merek
        </h3>
        <div className="space-y-3">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => handleBrandChange(brand)}
                className="h-4 w-4 rounded border-black/20 bg-white text-primary focus:ring-primary accent-primary"
              />
              <span className="font-text text-sm text-text-secondary hover:text-text-dominant transition-colors">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display text-sm font-semibold text-primary uppercase tracking-wider mb-4">
          Tipe
        </h3>
        <div className="space-y-3">
          {types.map((type) => (
            <label key={type} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => handleTypeChange(type)}
                className="h-4 w-4 rounded border-black/20 bg-white text-primary focus:ring-primary accent-primary"
              />
              <span className="font-text text-sm text-text-secondary hover:text-text-dominant transition-colors">
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display text-sm font-semibold text-primary uppercase tracking-wider mb-4">
          Harga (per hari)
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => {
              handlePriceSearchChange(search, e.target.value, maxPrice);
            }}
            placeholder="Min"
            className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 font-text text-sm text-text-dominant placeholder:text-text-tertiary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <span className="text-text-tertiary">-</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => {
              handlePriceSearchChange(search, minPrice, e.target.value);
            }}
            placeholder="Max"
            className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 font-text text-sm text-text-dominant placeholder:text-text-tertiary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-4 border-t border-black/10">
        {(search ||
          selectedCategory ||
          selectedBrands.length > 0 ||
          selectedTypes.length > 0 ||
          minPrice ||
          maxPrice) && (
          <button
            onClick={clearFilters}
            type="button"
            className="flex items-center justify-center gap-2 w-full py-2 text-sm font-text text-text-tertiary hover:text-text-dominant transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
            Hapus Filter
          </button>
        )}
      </div>
    </div>
  );
}
