'use client';

import { Loader2, Trash2, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteBooking } from '@/actions/admin-booking';

type DeleteBookingButtonProps = {
  bookingId: string;
};

export function DeleteBookingButton({ bookingId }: DeleteBookingButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    const result = await deleteBooking(bookingId);

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setShowConfirm(false);
    router.refresh();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        className="text-xs text-red-600 font-semibold hover:underline whitespace-nowrap"
      >
        <Trash2 className="w-3.5 h-3.5 inline-block mr-0.5" />
        Hapus
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            <div className="text-center mb-6">
              <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h2 className="font-display text-2xl font-semibold mb-2">Hapus Booking?</h2>
              <p className="font-text text-sm text-text-tertiary">
                Booking akan dihapus permanen dari database. Tindakan ini tidak dapat dibatalkan.
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
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full font-text font-semibold transition-colors disabled:bg-red-400 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Memproses...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
