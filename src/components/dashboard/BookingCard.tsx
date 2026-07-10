'use client';

import { Calendar, Camera } from 'lucide-react';
import Link from 'next/link';

type BookingCardProps = {
  booking: {
    id: string;
    start_date: string;
    end_date: string;
    duration: number;
    final_price: number;
    status: string;
    camera: {
      name: string;
      brand: string;
      image_url: string | null;
    };
  };
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Menunggu', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  confirmed: { label: 'Dikonfirmasi', color: 'text-blue-700', bg: 'bg-blue-100' },
  active: { label: 'Aktif', color: 'text-green-700', bg: 'bg-green-100' },
  completed: { label: 'Selesai', color: 'text-gray-700', bg: 'bg-gray-100' },
  cancelled: { label: 'Dibatalkan', color: 'text-red-700', bg: 'bg-red-100' },
};

export function BookingCard({ booking }: BookingCardProps) {
  const statusStyle = statusConfig[booking.status] || statusConfig.pending;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Link
      href={`/dashboard/bookings/${booking.id}`}
      className="block bg-white rounded-2xl border border-surface-light p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex gap-4">
        <div className="w-20 h-20 rounded-xl bg-surface-light flex items-center justify-center flex-shrink-0">
          {booking.camera.image_url ? (
            <img
              src={booking.camera.image_url}
              alt={booking.camera.name}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <Camera className="w-8 h-8 text-text-tertiary" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-display font-semibold text-lg truncate">{booking.camera.name}</h3>
              <p className="text-sm text-text-tertiary">{booking.camera.brand}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.color}`}
            >
              {statusStyle.label}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-text-secondary mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
              </span>
            </div>
            <span>•</span>
            <span>{booking.duration} hari</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-display text-xl font-semibold text-primary">
              {formatCurrency(booking.final_price)}
            </span>
            <span className="text-sm text-primary font-semibold">Lihat Detail →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
