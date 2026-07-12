'use client';

import { Loader2, Trash2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { deleteBooking, deleteMultipleBookings } from '@/actions/admin-booking';
import { StatusBadge, StatusSelect } from '@/components/admin/BookingStatus';

type BookingRow = {
  id: string;
  status: string;
  final_price: number;
  start_date: string;
  end_date: string;
  camera: { name: string; brand: string } | null;
  user: { full_name: string; email: string } | null;
};

function formatCurrency(v: number): string {
  return `Rp ${Math.round(v).toLocaleString('id-ID')}`;
}

export function AdminBookingsTable({ bookings }: { bookings: BookingRow[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allSelected = bookings.length > 0 && selected.size === bookings.length;

  const toggleAll = useCallback(() => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(bookings.map((b) => b.id)));
    }
  }, [allSelected, bookings]);

  const toggleOne = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleBulkDelete = async () => {
    if (selected.size === 0) return;
    setLoading(true);
    setError(null);

    const ids = Array.from(selected);
    const result = await deleteMultipleBookings(ids);

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setShowConfirm(false);
    setSelected(new Set());
    router.refresh();
  };

  return (
    <>
      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center justify-between bg-primary/5 rounded-xl px-4 py-3 border border-primary/20">
          <span className="font-text text-sm font-semibold text-primary">
            {selected.size} booking terpilih
          </span>
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-text text-sm font-semibold transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Hapus {selected.size} Booking
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full font-text text-sm">
            <thead className="bg-surface-dark text-text-tertiary">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="rounded border-black/20 accent-primary w-4 h-4"
                  />
                </th>
                {['Pengguna', 'Kamera', 'Periode', 'Total', 'Status', 'Aksi'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {bookings.map((b) => (
                <tr
                  key={b.id}
                  className={`hover:bg-black/5 transition-colors ${selected.has(b.id) ? 'bg-primary/5' : ''}`}
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selected.has(b.id)}
                      onChange={() => toggleOne(b.id)}
                      className="rounded border-black/20 accent-primary w-4 h-4"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-text-dominant">
                      {b.user?.full_name ?? '-'}
                    </p>
                    <p className="text-xs text-text-tertiary">{b.user?.email ?? ''}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-text-dominant">{b.camera?.name ?? '-'}</p>
                    <p className="text-xs text-text-tertiary">{b.camera?.brand ?? ''}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                    {b.start_date} → {b.end_date}
                  </td>
                  <td className="px-6 py-4 font-semibold text-green-700 whitespace-nowrap">
                    {formatCurrency(Number(b.final_price))}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <StatusSelect bookingId={b.id} current={b.status as 'pending'} />
                      <Link
                        href={`/admin/bookings/${b.id}`}
                        className="text-xs text-primary font-semibold hover:underline whitespace-nowrap"
                      >
                        Detail
                      </Link>
                      <button
                        type="button"
                        onClick={async () => {
                          if (window.confirm('Hapus booking ini?')) {
                            await deleteBooking(b.id);
                            router.refresh();
                          }
                        }}
                        className="text-xs text-red-600 font-semibold hover:underline whitespace-nowrap"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-text-tertiary">
                    Tidak ada booking
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            <div className="text-center mb-6">
              <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h2 className="font-display text-2xl font-semibold mb-2">Hapus {selected.size} Booking?</h2>
              <p className="font-text text-sm text-text-tertiary">
                {selected.size} booking akan dihapus permanen dari database. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 font-text text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setShowConfirm(false); setError(null); }}
                disabled={loading}
                className="flex-1 h-12 border border-black/15 rounded-full font-text font-semibold hover:bg-surface-dark transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleBulkDelete}
                disabled={loading}
                className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full font-text font-semibold transition-colors disabled:bg-red-400 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Memproses...' : 'Ya, Hapus Semua'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
