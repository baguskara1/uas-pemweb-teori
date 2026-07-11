'use client';

import { ShoppingCart, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem } = useCart();

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      )}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white border-l border-black/10 shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-black/10">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary" />
              <h2 className="font-display text-lg font-semibold">Keranjang</h2>
            </div>
            <button onClick={onClose} className="text-text-tertiary hover:text-text-dominant p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-text-tertiary">
                <ShoppingCart className="w-12 h-12 mb-3 opacity-40" />
                <p className="font-text text-sm">Keranjang masih kosong</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-black/10 bg-white"
                >
                  <div className="w-14 h-14 rounded-xl bg-surface-dark overflow-hidden shrink-0">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-text-tertiary text-xs">
                        N/A
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-text text-sm font-semibold text-text-dominant truncate">
                      {item.name}
                    </p>
                    <p className="font-text text-xs text-text-tertiary">
                      Rp {Math.round(item.price_per_day).toLocaleString('id-ID')} / hari
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                    aria-label="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="px-6 py-4 border-t border-black/10 space-y-3">
              <Link
                href="/cart"
                onClick={onClose}
                className="flex items-center justify-center w-full h-12 bg-primary hover:bg-primary-hover text-white font-text font-semibold rounded-full transition-colors"
              >
                Lanjutkan ke Checkout ({items.length})
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
