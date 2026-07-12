'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BOOKING_STATUS_LABEL as STATUS_LABEL, BOOKING_STATUS_COLOR as STATUS_COLOR } from '@/lib/constants';
import type { BookingStatus } from '@/lib/constants';
import { updateBookingStatus } from '@/actions/admin-booking';

export { STATUS_LABEL, STATUS_COLOR };

const ALL_STATUSES: BookingStatus[] = [
  'pending',
  'confirmed',
  'in_progress',
  'returned',
  'completed',
  'cancelled',
];

export function StatusBadge({ status }: { status: string }) {
  const s = status as BookingStatus;
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[s] ?? 'bg-surface-light text-text-tertiary'}`}
    >
      {STATUS_LABEL[s] ?? status}
    </span>
  );
}

export function StatusSelect({
  bookingId,
  current,
}: {
  bookingId: string;
  current: BookingStatus;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as BookingStatus;
    setLoading(true);
    await updateBookingStatus(bookingId, next);
    setLoading(false);
    router.refresh();
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      disabled={loading}
      className="border border-black/15 rounded-lg px-3 py-1.5 font-text text-sm bg-white text-text-dominant focus:outline-none focus:border-primary disabled:opacity-60"
    >
      {ALL_STATUSES.map((s) => (
        <option key={s} value={s}>
          {STATUS_LABEL[s]}
        </option>
      ))}
    </select>
  );
}
