'use client';

import { Camera, Heart, LogOut, Menu, Settings, ShoppingCart, User, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { CartModal } from '@/components/cart/CartModal';
import { WishlistDrawer } from '@/components/shared/WishlistDrawer';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

export function Navbar() {
  const { user, profile, signOut } = useAuth();
  const { count } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/10">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-touch">
          <Link href="/" className="flex items-center gap-2 group">
            <Camera className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="font-display font-semibold text-text-dominant">Sewa Kamera Ryox</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/cameras"
              className="font-text text-black/60 hover:text-primary transition-colors"
            >
              Katalog
            </Link>

            <button
              type="button"
              onClick={() => setWishlistOpen(true)}
              className="font-text text-black/60 hover:text-primary transition-colors relative focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:outline-none rounded-full p-1"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="font-text text-black/60 hover:text-primary transition-colors relative focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:outline-none rounded-full p-1"
              aria-label="Keranjang"
            >
              <ShoppingCart className="w-4 h-4" />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                  {count}
                </span>
              )}
            </button>

            {user ? (
              <>
                {profile?.role === 'admin' ? (
                  <Link
                    href="/admin"
                    className="font-text text-black/60 hover:text-primary transition-colors"
                  >
                    Admin
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="font-text text-black/60 hover:text-primary transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  type="button"
                  onClick={signOut}
                  className="flex items-center gap-2 font-text text-black/60 hover:text-primary transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="font-text text-black/60 hover:text-primary transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="inline-flex h-touch items-center justify-center px-6 bg-primary hover:bg-primary-hover text-white font-text rounded-full transition-colors font-semibold"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-text-dominant hover:text-primary transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-black/10">
            <div className="flex flex-col gap-4">
              <Link
                href="/cameras"
                className="font-text text-black/60 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Katalog
              </Link>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setWishlistOpen(true);
                }}
                className="flex items-center gap-2 font-text text-black/60 hover:text-primary transition-colors text-left focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:outline-none rounded-lg px-2 py-1 -ml-2"
              >
                <Heart className="w-4 h-4" />
                Wishlist
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCartOpen(true);
                }}
                className="flex items-center gap-2 font-text text-black/60 hover:text-primary transition-colors text-left focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:outline-none rounded-lg px-2 py-1 -ml-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Keranjang
                {count > 0 && (
                  <span className="w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                    {count}
                  </span>
                )}
              </button>

              {user ? (
                <>
                  {profile?.role === 'admin' ? (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 font-text text-black/60 hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Admin
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 font-text text-black/60 hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Dashboard
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut();
                    }}
                    className="flex items-center gap-2 font-text text-black/60 hover:text-primary transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 pt-4 border-t border-black/10">
                  <Link
                    href="/login"
                    className="font-text text-black/60 hover:text-primary transition-colors text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className="flex h-touch items-center justify-center px-6 bg-primary hover:bg-primary-hover text-white font-text rounded-full transition-colors font-semibold text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <WishlistDrawer open={wishlistOpen} onClose={() => setWishlistOpen(false)} />
      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
    </nav>
  );
}
