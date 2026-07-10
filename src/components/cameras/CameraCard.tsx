'use client';

import { Camera } from 'lucide-react';
import Link from 'next/link';

type CameraCardProps = {
  camera: {
    id: string;
    name: string;
    brand: string;
    type: string;
    price_per_day: number;
    image_url: string | null;
    is_available: boolean;
    stock: number;
  };
};

export function CameraCard({ camera }: CameraCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Link
      href={`/cameras/${camera.id}`}
      className="group flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
    >
      <div className="relative aspect-[4/3] w-full bg-white/5 overflow-hidden">
        {camera.image_url ? (
          <img
            src={camera.image_url}
            alt={camera.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="grid h-full place-items-center bg-gradient-to-br from-white/5 to-transparent">
            <Camera className="h-12 w-12 text-[#FDD26E]/50" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 font-text text-xs font-semibold rounded-full ${
              camera.is_available && camera.stock > 0
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/25'
            }`}
          >
            {camera.is_available && camera.stock > 0 ? 'Tersedia' : 'Habis'}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <p className="font-text text-xs text-white/50 uppercase tracking-wider">
          {camera.brand} · {camera.type}
        </p>
        <h3 className="mt-2 font-display text-xl font-semibold text-white group-hover:text-[#FDD26E] transition-colors line-clamp-1">
          {camera.name}
        </h3>
        <p className="mt-auto pt-4 font-text font-semibold text-[#FDD26E]">
          {formatCurrency(camera.price_per_day)}{' '}
          <span className="text-xs font-normal text-white/50">/ hari</span>
        </p>
      </div>
    </Link>
  );
}
