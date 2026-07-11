'use client';

import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { useState } from 'react';
import { FilterSidebar } from './FilterSidebar';

type MobileFilterToggleProps = {
  brands: string[];
  types: string[];
  defaultCategory?: string;
};

export function MobileFilterToggle({ brands, types, defaultCategory }: MobileFilterToggleProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border border-black/15 bg-white text-text-dominant font-text text-sm font-semibold transition-colors hover:border-primary"
      >
        <Filter className="w-4 h-4" />
        Filter
        {open ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
      </button>
      {open && (
        <div className="mt-4">
          <FilterSidebar brands={brands} types={types} defaultCategory={defaultCategory} />
        </div>
      )}
    </div>
  );
}
