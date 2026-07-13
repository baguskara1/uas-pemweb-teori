'use client';

import { CalendarDays, Loader2, ShoppingCart, Trash2, Wallet, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useToast } from '@/components/shared/Toast';
import { useCart } from '@/contexts/CartContext';
import { PAYMENT_METHODS } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';

type CartModalProps = {
  open: boolean;
  onClose: () => void;
};

type PaymentMethod = {
  id: string;
  label: string;
  group: 'ewallet' | 'bank_transfer' | 'credit_card' | 'convenience_store';
  icon: React.ReactNode;
};

const GROUP_LABELS: Record<string, string> = {
  ewallet: 'E-Wallet',
  bank_transfer: 'Transfer Bank',
  credit_card: 'Kartu Kredit',
  convenience_store: 'Convenience Store',
};

export function CartModal({ open, onClose }: CartModalProps) {
  const { items, removeItem, clearCart } = useCart();
  const { show } = useToast();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('gopay');
  const [loading, setLoading] = useState(false);
  const [qrPayment, setQrPayment] = useState<{ qrString: string; amount: number; orderId: string } | null>(null);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLElement>(null);
  const lastFocusableRef = useRef<HTMLElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

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

  const itemDescription = (item: (typeof items)[0]) => {
    if (item.category === 'camera') return 'Body Only';
    if (item.category === 'lens') return 'Termasuk tutup lensa depan & belakang, tas pouch';
    if (item.type === 'Baterai') return 'Termasuk charger';
    if (item.type === 'SD Card') return 'Termasuk card reader USB';
    if (item.type === 'Lighting') return 'Termasuk diffuser, remote control';
    if (item.type === 'Mic') return 'Termasuk deadcat, kabel jack';
    return 'Unit only';
  };

  const handleCheckout = async () => {
    if (!canCheckout || loading) return;
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
        setQrPayment({
          qrString: json.data.qrString,
          amount: json.data.amount,
          orderId: json.data.orderId,
        });
        setLoading(false);
      } else {
        window.location.href = json.data.snapUrl;
      }
    } catch {
      alert('Terjadi kesalahan. Silakan coba lagi.');
      setLoading(false);
    }
  };

      // Focus trap and modal accessibility
  useEffect(() => {
    if (!open) setQrPayment(null);

    if (open) {
      // Store the element that triggered the modal
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Find focusable elements
      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      if (focusableElements && focusableElements.length > 0) {
        firstFocusableRef.current = focusableElements[0];
        lastFocusableRef.current = focusableElements[focusableElements.length - 1];

        // Focus first focusable element
        setTimeout(() => {
          firstFocusableRef.current?.focus();
        }, 0);
      }

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore focus to trigger element
      document.body.style.overflow = '';
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      // Escape to close
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Tab trap
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );

        if (!focusableElements || focusableElements.length === 0) return;

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const groupedMethods = PAYMENT_METHODS.reduce(
    (acc, m) => {
      (acc[m.group] ??= []).push(m);
      return acc;
    },
    {} as Record<string, PaymentMethod[]>,
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-start justify-center sm:pt-8 sm:pt-12 pb-0 sm:pb-4">
      <div
        className="absolute inset-0 bg-black/30"
        style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className="relative z-10 w-full max-w-2xl sm:mx-4 bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl border border-black/10 flex flex-col max-h-[85vh] sm:max-h-[calc(100vh-4rem)]"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/10 shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" aria-hidden="true" />
            <h2 id="cart-title" className="font-display text-lg font-semibold">
              Keranjang
            </h2>
            {items.length > 0 && (
              <span className="text-xs text-text-tertiary font-text">({items.length} item)</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs font-text text-red-500 hover:text-red-700 transition-colors"
              >
                Kosongkan
              </button>
            )}
            <button
              onClick={onClose}
              className="text-text-tertiary hover:text-text-dominant p-1"
              aria-label="Tutup keranjang"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {qrPayment ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
                <Wallet className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2 text-text-dominant">
                Pembayaran QRIS
              </h3>
              <p className="font-text text-sm text-text-tertiary mb-6 max-w-xs">
                Scan kode QR di bawah menggunakan aplikasi e-wallet Anda (GoPay, OVO, DANA, ShopeePay, LinkAja)
              </p>
              <div className="bg-white rounded-2xl border border-black/10 p-4 mb-4 shadow-sm">
                <img
                  src={qrPayment.qrString}
                  alt="QRIS"
                  className="w-56 h-56"
                />
              </div>
              <div className="space-y-1 mb-4">
                <p className="font-text text-sm font-semibold text-text-dominant">
                  Total: {formatCurrency(qrPayment.amount)}
                </p>
                <p className="font-text text-xs text-text-tertiary">
                  Order: {qrPayment.orderId}
                </p>
              </div>
              <p className="font-text text-xs text-text-tertiary">
                Status pembayaran akan otomatis terupdate. Cek di menu Booking Saya.
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-text-tertiary">
              <ShoppingCart className="w-12 h-12 mb-3 opacity-40" aria-hidden="true" />
              <p className="font-text text-sm">Keranjang masih kosong</p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-black/10"
                  >
                    <div className="w-16 h-16 rounded-xl bg-surface-dark overflow-hidden shrink-0">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="object-contain"
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
                      <h3 className="font-display text-base font-semibold">{item.name}</h3>
                      <p className="font-text text-[11px] text-text-tertiary mt-0.5">
                        {itemDescription(item)}
                      </p>
                      <p className="font-text text-sm text-primary font-semibold mt-0.5">
                        {formatCurrency(item.price_per_day)} / hari
                        {durationDays > 0 && (
                          <span className="font-normal text-text-tertiary text-xs ml-2">
                            × {durationDays} hari ={' '}
                            {formatCurrency(item.price_per_day * durationDays)}
                          </span>
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        removeItem(item.id);
                        show(`${item.name} dihapus dari keranjang`, 'info');
                      }}
                      className="text-red-500 hover:text-red-700 transition-colors p-1 shrink-0"
                      aria-label={`Hapus ${item.name} dari keranjang`}
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-black/10 p-5">
                <h3 className="font-display text-sm font-semibold mb-3 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-primary" aria-hidden="true" />
                  Atur Jadwal Sewa
                </h3>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label
                      htmlFor="cart-start-date"
                      className="block text-[10px] font-semibold text-text-tertiary uppercase mb-1"
                    >
                      Tanggal Mulai
                    </label>
                    <input
                      id="cart-start-date"
                      type="date"
                      value={startDate}
                      min={today}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full border border-black/15 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="cart-end-date"
                      className="block text-[10px] font-semibold text-text-tertiary uppercase mb-1"
                    >
                      Tanggal Selesai
                    </label>
                    <input
                      id="cart-end-date"
                      type="date"
                      value={endDate}
                      min={startDate || today}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full border border-black/15 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-surface-dark p-5">
                <h3 className="font-display text-sm font-semibold mb-2 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-primary" aria-hidden="true" />
                  Persyaratan Penyewaan
                </h3>
                <div className="space-y-1.5 font-text text-xs text-text-secondary">
                  <p>
                    <span className="text-primary mr-2">•</span>1 KTP / SIM (asli, masih berlaku)
                  </p>
                  <p>
                    <span className="text-primary mr-2">•</span>1 Kartu Pelajar / Kartu Identitas
                    Lainnya
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-display text-sm font-semibold mb-3">Pilih Metode Bayar</h3>
                <fieldset className="space-y-3">
                  <legend className="font-text text-[10px] font-semibold uppercase tracking-wider text-text-tertiary mb-2">
                    Metode Pembayaran
                  </legend>
                  {Object.entries(groupedMethods).map(([group, methods]) => (
                    <div key={group}>
                      <p className="font-text text-[10px] font-semibold uppercase tracking-wider text-text-tertiary mb-2">
                        {GROUP_LABELS[group]}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {methods.map((m) => (
                          <label
                            key={m.id}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-text transition-all cursor-pointer ${
                              paymentMethod === m.id
                                ? 'border-primary bg-primary/10 text-primary font-semibold'
                                : 'border-black/10 text-text-secondary hover:border-black/20'
                            }`}
                          >
                            <input
                              type="radio"
                              name="payment-method"
                              value={m.id}
                              checked={paymentMethod === m.id}
                              onChange={() => setPaymentMethod(m.id)}
                              className="sr-only"
                            />
                            <span aria-hidden="true">{m.icon}</span>
                            {m.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </fieldset>
              </div>
            </>
          )}
        </div>

        {qrPayment && (
          <div className="shrink-0 px-6 py-4 border-t border-black/10">
            <Link
              href="/dashboard/bookings"
              onClick={onClose}
              className="w-full h-12 bg-primary hover:bg-primary-hover text-white rounded-full font-text font-semibold transition-colors flex items-center justify-center"
            >
              Lihat Booking Saya
            </Link>
          </div>
        )}
        {!qrPayment && items.length > 0 && (
          <div className="shrink-0 px-6 py-4 border-t border-black/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-display font-semibold">Total</span>
              <span className="font-display text-xl font-semibold text-primary">
                {formatCurrency(totals.subtotal)}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              disabled={!canCheckout}
              className="w-full h-12 bg-primary hover:bg-primary-hover text-white rounded-full font-text font-semibold transition-colors disabled:bg-surface-light disabled:text-text-tertiary disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Memproses...
                </>
              ) : durationDays > 0 ? (
                `Bayar ${formatCurrency(totals.subtotal)}`
              ) : (
                'Atur jadwal sewa terlebih dahulu'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
