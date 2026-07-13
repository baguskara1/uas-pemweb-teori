'use client';

import { Loader2, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type CancelBookingButtonProps = {
  bookingId: string;
  label?: string;
};

export function CancelBookingButton({ bookingId, label = 'Batalkan Booking' }: CancelBookingButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleCancel = async () => {
    setLoading(true);

    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);

    setLoading(false);

    if (error) {
      alert(`Gagal membatalkan ${label.toLowerCase()}`);
      return;
    }

    setShowConfirm(false);
    router.refresh();
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="px-6 py-2 rounded-full border border-red-300 text-red-600 font-semibold hover:bg-red-50 transition-colors"
      >
        {label}
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            <div className="text-center mb-6">
              <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h2 className="font-display text-2xl font-semibold mb-2">{label}?</h2>
              <p className="text-text-tertiary">
                Tindakan ini tidak dapat dibatalkan. Booking akan diubah statusnya menjadi
                dibatalkan.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={loading}
                className="flex-1 h-12 border border-black/15 rounded-full font-semibold hover:bg-surface-dark transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Memproses...' : 'Ya, Batalkan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
