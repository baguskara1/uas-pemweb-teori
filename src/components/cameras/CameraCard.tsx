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
      className="group flex flex-col bg-white border border-surface-light/50 transition-all duration-300 hover:shadow-lg hover:border-transparent"
    >
      <div className="relative aspect-[4/3] w-full bg-surface-light overflow-hidden">
        {camera.image_url ? (
          <img
            src={camera.image_url}
            alt={camera.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="grid h-full place-items-center bg-gradient-to-br from-white to-surface-light">
            <Camera className="h-12 w-12 text-primary/80" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 font-text text-xs font-semibold rounded-full ${
              camera.is_available && camera.stock > 0
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {camera.is_available && camera.stock > 0 ? 'Tersedia' : 'Habis'}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <p className="font-text text-xs text-text-tertiary uppercase tracking-wider">
          {camera.brand} · {camera.type}
        </p>
        <h3 className="mt-2 font-display text-xl font-semibold text-text-dominant group-hover:text-primary transition-colors line-clamp-1">
          {camera.name}
        </h3>
        <p className="mt-auto pt-4 font-text font-semibold text-primary">
          {formatCurrency(camera.price_per_day)}{' '}
          <span className="text-xs font-normal text-text-tertiary">/ hari</span>
        </p>
      </div>
    </Link>
  );
}
