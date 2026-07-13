'use client';

import { ShoppingCart, Trash2, QrCode, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const { items, removeItem, clearCart } = useCart();

  const [dates, setDates] = useState<Record<string, { start: string; end: string }>>({});
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState<{ qrString: string; orderId: string; amount: number } | null>(null);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const updateDate = (id: string, field: 'start' | 'end', value: string) => {
    setDates((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const calcDuration = useCallback((start: string, end: string) => {
    if (!start || !end) return 0;
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, []);

  const totals = useMemo(() => {
    let subtotal = 0;
    let totalDays = 0;
    let itemCount = 0;
    for (const item of items) {
      const d = dates[item.id];
      const days = d ? calcDuration(d.start, d.end) : 0;
      if (days > 0) {
        subtotal += item.price_per_day * days;
        totalDays += days;
        itemCount++;
      }
    }
    return { subtotal, totalDays, itemCount };
  }, [items, dates, calcDuration]);

  const allHaveDates =
    items.length > 0 &&
    items.every((item) => {
      const d = dates[item.id];
      return d?.start && d.end && calcDuration(d.start, d.end) > 0;
    });

  const handleCheckout = async () => {
    if (!allHaveDates || loading) return;
    setLoading(true);

    try {
      const firstItemDates = items[0] ? dates[items[0].id] : null;
      const payload = {
        items: items.map((item) => ({
          id: item.id,
          start_date: dates[item.id].start,
          end_date: dates[item.id].end,
          duration: calcDuration(dates[item.id].start, dates[item.id].end),
        })),
        start_date: firstItemDates?.start || '',
        end_date: firstItemDates?.end || '',
      };

      const res = await fetch('/api/payments/midtrans/multi-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            start_date: dates[item.id].start,
            end_date: dates[item.id].end,
            duration: calcDuration(dates[item.id].start, dates[item.id].end),
          })),
          start_date: firstItemDates?.start || '',
          end_date: firstItemDates?.end || '',
        }),
      });

      const json = await res.json();

      if (!json.success) {
        alert(json.message || 'Gagal memproses checkout');
        setLoading(false);
        return;
      }

      clearCart();

      // QRIS: tampilkan QR code langsung
      if (json.data.method === 'qris') {
        setQrData({
          qrString: json.data.qrString,
          orderId: json.data.orderId,
          amount: json.data.amount,
        });
        setLoading(false);
        return;
      }

      // Non-QRIS: redirect ke Midtrans
      window.location.href = json.data.snapUrl;
    } catch {
      alert('Terjadi kesalahan. Silakan coba lagi.');
      setLoading(false);
    }
  };

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

  const formatCurrency = (v: number) => `Rp ${Math.round(v).toLocaleString('id-ID')}`;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-container px-4 py-8 pb-32 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-7 h-7 text-primary" />
            <div>
              <h1 className="font-display text-3xl font-semibold">Keranjang</h1>
              <p className="font-text text-text-tertiary text-sm mt-1">
                {items.length} item — atur jadwal sewa masing-masing
              </p>
            </div>
          </div>
          <button
            onClick={clearCart}
            className="font-text text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            Kosongkan
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Item list */}
          <div className="flex-1 w-full space-y-4">
            {items.map((item) => {
              const d = dates[item.id] || { start: '', end: '' };
              const days = calcDuration(d.start, d.end);

              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border border-black/10 bg-white"
                >
                  <div className="w-full sm:w-24 h-24 rounded-xl bg-surface-dark overflow-hidden shrink-0">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-text-tertiary text-xs">
                        N/A
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-text text-xs text-text-tertiary uppercase tracking-wider">
                      {item.brand}
                    </p>
                    <h3 className="font-display text-lg font-semibold">{item.name}</h3>
                    <p className="font-text text-sm text-primary font-semibold mt-1">
                      {formatCurrency(item.price_per_day)} / hari
                    </p>
                  </div>

                  <div className="flex flex-col sm:items-end gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-text-tertiary uppercase mb-1">
                          Mulai
                        </label>
                        <input
                          type="date"
                          value={d.start}
                          min={today}
                          onChange={(e) => updateDate(item.id, 'start', e.target.value)}
                          className="w-full sm:w-36 border border-black/15 rounded-xl px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-text-tertiary uppercase mb-1">
                          Selesai
                        </label>
                        <input
                          type="date"
                          value={d.end}
                          min={d.start || today}
                          onChange={(e) => updateDate(item.id, 'end', e.target.value)}
                          className="w-full sm:w-36 border border-black/15 rounded-xl px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>
                    </div>
                    {days > 0 && (
                      <p className="font-text text-xs text-text-tertiary">
                        {days} hari × {formatCurrency(item.price_per_day)} ={' '}
                        <span className="font-semibold text-text-dominant">
                          {formatCurrency(item.price_per_day * days)}
                        </span>
                      </p>
                    )}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                      aria-label="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="w-full lg:w-80 shrink-0 bg-surface-dark border border-black/10 rounded-2xl p-6 lg:sticky lg:top-24">
            <h2 className="font-display text-lg font-semibold mb-4">Ringkasan</h2>
            <div className="space-y-3 font-text text-sm">
              <div className="flex justify-between">
                <span className="text-text-tertiary">Item</span>
                <span>{items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Total hari sewa</span>
                <span>{totals.totalDays}</span>
              </div>
              <div className="border-t border-black/10 pt-3 flex justify-between items-baseline">
                <span className="font-display font-semibold">Total</span>
                <span className="font-display text-xl font-semibold text-primary">
                  {formatCurrency(totals.subtotal)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={!allHaveDates || loading}
              className="w-full mt-6 h-12 bg-primary hover:bg-primary-hover text-white rounded-full font-text font-semibold transition-colors disabled:bg-surface-light disabled:text-text-tertiary disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Memproses...' : `Bayar ${formatCurrency(totals.subtotal)}`}
            </button>

            {!allHaveDates && items.length > 0 && (
              <p className="font-text text-xs text-text-tertiary text-center mt-3">
                Atur jadwal sewa untuk semua item terlebih dahulu
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
              Scan QR Code di bawah ini menggunakan aplikasi bank/e-wallet Anda
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
