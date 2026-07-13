'use client';

import { CreditCard, Loader2, Wallet, QrCode, Landmark } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/shared/Toast';

type PayNowButtonProps = {
  bookingId: string;
  orderGroup?: string | null;
};

const paymentOptions = [
  { id: 'gopay', label: 'GoPay', icon: <Wallet className="w-3.5 h-3.5" /> },
  { id: 'bca_va', label: 'BCA VA', icon: <Landmark className="w-3.5 h-3.5" /> },
  { id: 'qris', label: 'QRIS', icon: <QrCode className="w-3.5 h-3.5" /> },
  { id: 'shopeepay', label: 'ShopeePay', icon: <Wallet className="w-3.5 h-3.5" /> },
];

export function PayNowButton({ bookingId }: PayNowButtonProps) {
  const { show } = useToast();
  const [loading, setLoading] = useState(false);
  const [payMethod, setPayMethod] = useState('gopay');

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payments/midtrans/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, paymentMethod: payMethod }),
      });
      const data = await res.json();

      if (!data.success) {
        show(data.message || 'Gagal memproses pembayaran', 'error');
        setLoading(false);
        return;
      }

      if (data.data?.snapUrl) {
        window.location.href = data.data.snapUrl;
      } else {
        show('Gagal mendapatkan halaman pembayaran', 'error');
        setLoading(false);
      }
    } catch {
      show('Gagal terhubung ke server pembayaran', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:w-auto space-y-3">
      <div className="grid grid-cols-2 gap-1.5">
        {paymentOptions.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setPayMethod(m.id)}
            className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl border text-xs font-text transition-all ${
              payMethod === m.id
                ? 'border-primary bg-primary/10 text-primary font-semibold'
                : 'border-black/10 text-text-secondary hover:border-black/20'
            }`}
          >
            {m.icon} {m.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={handlePay}
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full px-8 py-4 bg-primary hover:bg-primary-hover text-white font-text font-semibold rounded-full transition-all disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <CreditCard className="w-5 h-5" />
        )}
        {loading ? 'Memproses...' : 'Bayar Sekarang'}
      </button>
    </div>
  );
}
