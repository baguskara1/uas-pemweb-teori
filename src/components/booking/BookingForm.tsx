'use client';

import { Calendar, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { createBooking } from '@/actions/booking';
import { DatePicker } from '@/components/booking/DatePicker';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/lib/utils';

type Camera = {
  id: string;
  name: string;
  brand: string;
  type: string;
  price_per_day: number;
  image_url: string | null;
  stock: number;
  is_available: boolean;
};

type BookingFormProps = {
  camera: Camera;
};

export function BookingForm({ camera }: BookingFormProps) {
  const { user } = useAuth();
  const router = useRouter();

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const durationDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }, [startDate, endDate]);

  const totalPrice = durationDays * camera.price_per_day;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const isFormValid = startDate && endDate && durationDays > 0 && !loading;

  const handleSubmit = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setShowConfirm(true);
  };

  const confirmBooking = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    const result = await createBooking({
      camera_id: camera.id,
      start_date: startDate,
      end_date: endDate,
      duration: durationDays,
      total_price: totalPrice,
    });

    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Terjadi kesalahan');
      return;
    }

    setShowConfirm(false);
    if (result.data?.id) {
      router.push(`/dashboard/bookings/${result.data.id}`);
    } else {
      router.push('/dashboard/bookings');
    }
    router.refresh();
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DatePicker
            label="Tanggal Mulai"
            value={startDate}
            onChange={setStartDate}
            minDate={today}
          />
          <DatePicker
            label="Tanggal Selesai"
            value={endDate}
            onChange={setEndDate}
            minDate={startDate || today}
          />
        </div>

        {/* Price Summary */}
        <div className="rounded-2xl border border-surface-light p-6 bg-surface-light/30">
          <h3 className="font-display text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-4">
            Ringkasan Biaya
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between font-text text-sm">
              <span className="text-text-tertiary">Harga per hari</span>
              <span className="font-medium">{formatCurrency(camera.price_per_day)}</span>
            </div>
            <div className="flex justify-between font-text text-sm">
              <span className="text-text-tertiary">Durasi sewa</span>
              <span className="font-medium">{durationDays > 0 ? `${durationDays} hari` : '—'}</span>
            </div>
            <div className="border-t border-surface-light pt-3 flex justify-between items-baseline">
              <span className="font-display text-base font-semibold">Total Bayar</span>
              <span className="font-display text-2xl font-semibold text-primary">
                {formatCurrency(totalPrice)}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 font-text text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="flex items-center justify-center w-full h-14 bg-primary hover:bg-primary-hover active:bg-primary-press text-white font-text text-lg font-semibold rounded-full transition-colors gap-2 disabled:bg-surface-light disabled:text-text-tertiary disabled:cursor-not-allowed"
        >
          <Calendar className="w-5 h-5" />
          {user ? 'Konfirmasi Booking' : 'Login untuk Booking'}
        </button>

        <p className="text-center font-text text-xs text-text-tertiary">
          Dengan klik tombol di atas, Anda menyetujui aturan sewa yang berlaku.
        </p>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-tight">
                  Konfirmasi Booking
                </h2>
                <p className="font-text text-sm text-text-tertiary mt-1">
                  Pastikan semua data sudah benar
                </p>
              </div>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={loading}
                className="text-text-tertiary hover:text-text-dominant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between font-text text-sm py-2 border-b border-surface-light">
                <span className="text-text-tertiary">Kamera</span>
                <span className="font-medium text-right">{camera.name}</span>
              </div>
              <div className="flex justify-between font-text text-sm py-2 border-b border-surface-light">
                <span className="text-text-tertiary">Mulai</span>
                <span className="font-medium">{formatDate(startDate)}</span>
              </div>
              <div className="flex justify-between font-text text-sm py-2 border-b border-surface-light">
                <span className="text-text-tertiary">Selesai</span>
                <span className="font-medium">{formatDate(endDate)}</span>
              </div>
              <div className="flex justify-between font-text text-sm py-2 border-b border-surface-light">
                <span className="text-text-tertiary">Durasi</span>
                <span className="font-medium">{durationDays} hari</span>
              </div>
              <div className="flex justify-between items-baseline py-2">
                <span className="font-display font-semibold">Total</span>
                <span className="font-display text-xl font-semibold text-primary">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={loading}
                className="flex-1 h-12 border border-surface-light rounded-full font-text font-semibold hover:bg-surface-light/30 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmBooking}
                disabled={loading}
                className="flex-1 h-12 bg-primary hover:bg-primary-hover text-white rounded-full font-text font-semibold transition-colors disabled:bg-primary/70 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Memproses...' : 'Ya, Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
