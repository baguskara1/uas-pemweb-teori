'use client';

import { CreditCard, Landmark, QrCode, ShoppingCart, Store, Trash2, Wallet, X, CalendarDays } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const { items, removeItem, clearCart } = useCart();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState<{ qrString: string; orderId: string; amount: number } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('gopay');

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const calcDuration = (start: string, end: string) => {
    if (!start || !end) return 0;
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const durationDays = calcDuration(startDate, endDate);

  const totals = useMemo(() => {
    let subtotal = 0;
    for (const item of items) {
      if (durationDays > 0) subtotal += item.price_per_day * durationDays;
    }
    return { subtotal, totalDays: durationDays };
  }, [items, durationDays]);

  const canCheckout = items.length > 0 && durationDays > 0 && !loading;

  const handleCheckout = async () => {
    if (!canCheckout) return;
    setLoading(true);

    try {
      const res = await fetch('/api/payments/midtrans/multi-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payMethod: paymentMethod,
          start_date: startDate,
          end_date: endDate,
          items: items.map((item) => ({
            id: item.id,
            start_date: startDate,
            end_date: endDate,
            duration: durationDays,
          })),
        }),
      });

      const json = await res.json();

      if (!json.success) {
        alert(json.message || 'Gagal memproses checkout');
        setLoading(false);
        return;
      }

      clearCart();
      setStartDate('');
      setEndDate('');

      if (json.data.method === 'qris') {
        setQrData({
          qrString: json.data.qrString,
          orderId: json.data.orderId,
          amount: json.data.amount,
        });
        setLoading(false);
        return;
      }

      window.location.href = json.data.snapUrl;
    } catch {
      alert('Terjadi kesalahan. Silakan coba lagi.');
      setLoading(false);
    }
  };

  const formatCurrency = (v: number) => `Rp ${Math.round(v).toLocaleString('id-ID')}`;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-container px-4 py-12 text-center">
          <ShoppingCart className="w-16 h-16 text-black/20 mx-auto mb-4" />
          <h1 className="font-display text-3xl font-semibold mb-2">
            <ShoppingCart className="w-7 h-7 text-primary inline-block mr-2 -mt-1 align-middle" />
            Keranjang Kosong
          </h1>
          <p className="font-text text-text-tertiary mb-8">
            Belum ada item yang ditambahkan ke keranjang.
          </p>
          <Link
            href="/cameras"
            className="inline-flex items-center h-12 px-6 bg-primary text-white rounded-full font-text font-semibold hover:bg-primary-hover transition-colors"
          >
            Jelajahi Katalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-container px-4 py-8 pb-32 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-semibold">Keranjang Bundle</h1>
              <p className="font-text text-text-tertiary text-sm mt-1">
                {items.length} item — 1 transaksi sewa bundle
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={clearCart}
            className="font-text text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            Kosongkan
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* Left: Items + Schedule */}
          <div className="space-y-6">
            {/* Shared Date Picker */}
            <div className="bg-surface-dark border border-black/10 rounded-2xl p-5">
              <h3 className="font-display text-sm font-semibold mb-3 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-primary" />
                Jadwal Sewa Bundle
              </h3>
              <p className="font-text text-xs text-text-tertiary mb-4">
                Semua item dalam bundle ini akan disewa dalam periode yang sama
              </p>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label htmlFor="cart-start" className="block text-[10px] font-semibold text-text-tertiary uppercase mb-1">
                    Tanggal Mulai
                  </label>
                  <input
                    id="cart-start"
                    type="date"
                    value={startDate}
                    min={today}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border border-black/15 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="cart-end" className="block text-[10px] font-semibold text-text-tertiary uppercase mb-1">
                    Tanggal Selesai
                  </label>
                  <input
                    id="cart-end"
                    type="date"
                    value={endDate}
                    min={startDate || today}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border border-black/15 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Item list */}
            <div className="space-y-3">
              <h3 className="font-display text-sm font-semibold text-text-tertiary uppercase tracking-wider">
                Item ({items.length})
              </h3>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border border-black/10 bg-white"
                >
                  <div className="w-full sm:w-20 h-20 rounded-xl bg-surface-dark overflow-hidden shrink-0">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-text-tertiary text-xs">N/A</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-text text-xs text-text-tertiary uppercase tracking-wider">{item.brand}</p>
                    <h3 className="font-display text-base font-semibold">{item.name}</h3>
                    <p className="font-text text-xs text-text-tertiary mt-0.5 capitalize">{item.category}</p>
                    <p className="font-text text-sm text-primary font-semibold mt-1">
                      {formatCurrency(item.price_per_day)} / hari
                      {durationDays > 0 && (
                        <span className="font-normal text-text-tertiary text-xs ml-2">
                          × {durationDays} hari = {formatCurrency(item.price_per_day * durationDays)}
                        </span>
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors p-1 shrink-0 self-start"
                    aria-label={`Hapus ${item.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

          </div>

          {/* Right: Summary */}
          <div className="bg-surface-dark border border-black/10 rounded-2xl p-6 lg:sticky lg:top-24">
            <h2 className="font-display text-lg font-semibold mb-4">Ringkasan Bundle</h2>
            <div className="space-y-3 font-text text-sm">
              <div className="flex justify-between">
                <span className="text-text-tertiary">Jumlah item</span>
                <span>{items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Durasi sewa</span>
                <span>{durationDays > 0 ? `${durationDays} hari` : '-'}</span>
              </div>
              <div className="border-t border-black/10 pt-3 flex justify-between items-baseline">
                <span className="font-display font-semibold">Total</span>
                <span className="font-display text-xl font-semibold text-primary">
                  {formatCurrency(totals.subtotal)}
                </span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mt-4">
              <p className="font-text text-[10px] font-semibold uppercase tracking-wider text-text-tertiary mb-2">Metode Bayar</p>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'gopay', label: 'GoPay', icon: <Wallet className="w-3.5 h-3.5" /> },
                  { id: 'qris', label: 'QRIS', icon: <QrCode className="w-3.5 h-3.5" /> },
                  { id: 'bca_va', label: 'BCA VA', icon: <Landmark className="w-3.5 h-3.5" /> },
                  { id: 'shopeepay', label: 'ShopeePay', icon: <Wallet className="w-3.5 h-3.5" /> },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl border text-xs font-text transition-all ${
                      paymentMethod === m.id
                        ? 'border-primary bg-primary/10 text-primary font-semibold'
                        : 'border-black/10 text-text-secondary hover:border-black/20'
                    }`}
                  >
                    {m.icon} {m.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={!canCheckout}
              className="w-full mt-4 h-12 bg-primary hover:bg-primary-hover text-white rounded-full font-text font-semibold transition-colors disabled:bg-surface-light disabled:text-text-tertiary disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                'Memproses...'
              ) : durationDays > 0 ? (
                `Bayar ${formatCurrency(totals.subtotal)}`
              ) : (
                'Atur jadwal sewa terlebih dahulu'
              )}
            </button>

            {!canCheckout && items.length > 0 && (
              <p className="font-text text-xs text-text-tertiary text-center mt-3">
                Atur jadwal sewa bundle terlebih dahulu
              </p>
            )}
          </div>
        </div>
      </div>

      {/* QRIS QR Code Modal */}
      {qrData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center relative">
            <button
              type="button"
              onClick={() => setQrData(null)}
              className="absolute top-4 right-4 text-text-tertiary hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center justify-center gap-2 mb-4">
              <QrCode className="w-6 h-6 text-primary" />
              <h2 className="font-display text-xl font-semibold">Bayar dengan QRIS</h2>
            </div>
            <p className="font-text text-sm text-text-tertiary mb-4">
              Scan QR Code menggunakan aplikasi e-wallet Anda
            </p>
            <div className="bg-white border-2 border-black/10 rounded-2xl p-4 mb-4">
              <Image
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData.qrString)}`}
                alt="QRIS QR Code"
                width={250}
                height={250}
                unoptimized
                className="w-full max-w-[250px] mx-auto"
              />
            </div>
            <div className="space-y-2 font-text text-sm">
              <div className="flex justify-between">
                <span className="text-text-tertiary">Order ID</span>
                <span className="font-mono text-xs">{qrData.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Total Bayar</span>
                <span className="font-semibold text-primary">
                  Rp {qrData.amount.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
            <Link
              href="/dashboard/bookings"
              className="mt-6 w-full h-12 bg-primary hover:bg-primary-hover text-white rounded-full font-text font-semibold transition-colors flex items-center justify-center"
            >
              Lihat Status Pesanan
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
