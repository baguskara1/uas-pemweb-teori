'use client';

import { CreditCard, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/shared/Toast';
import { snapConfig } from '@/lib/midtrans';

type PayNowButtonProps = {
  bookingId: string;
};

type MidtransSnap = {
  pay: (token: string, options?: {
    onSuccess?: () => void;
    onPending?: () => void;
    onError?: () => void;
    onClose?: () => void;
  }) => void;
};

export function PayNowButton({ bookingId }: PayNowButtonProps) {
  const { show } = useToast();
  const [loading, setLoading] = useState(false);

  const loadSnapScript = (): Promise<void> => {
    return new Promise((resolve) => {
      if ((window as { snap?: MidtransSnap }).snap) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
      script.setAttribute('data-client-key', snapConfig.clientKey);
      script.onload = () => resolve();
      script.onerror = () => resolve();
      document.body.appendChild(script);
    });
  };

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payments/midtrans/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, paymentMethod: 'qris' }),
      });
      const data = await res.json();

      if (!data.success) {
        show(data.message || 'Gagal memproses pembayaran', 'error');
        setLoading(false);
        return;
      }

      await loadSnapScript();

      const midSnap = (window as { snap?: MidtransSnap }).snap;
      if (midSnap && data.data?.snapToken) {
        midSnap.pay(data.data.snapToken, {
          onSuccess: () => {
            show('Pembayaran berhasil!', 'success');
            window.location.reload();
          },
          onPending: () => {
            show('Pembayaran sedang diproses', 'info');
          },
          onError: () => {
            show('Pembayaran gagal, silakan coba lagi', 'error');
          },
          onClose: () => {
            setLoading(false);
          },
        });
      }
    } catch {
      show('Gagal terhubung ke server pembayaran', 'error');
    }
    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={handlePay}
      disabled={loading}
      className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 bg-primary hover:bg-primary-hover text-white font-text font-semibold rounded-full transition-all disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <CreditCard className="w-5 h-5" />
      )}
      {loading ? 'Memproses...' : 'Bayar Sekarang'}
    </button>
  );
}
