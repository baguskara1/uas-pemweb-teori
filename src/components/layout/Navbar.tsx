'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useState } from 'react';
import { Camera, Menu, X, LogOut, User, Settings } from 'lucide-react';

export function Navbar() {
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-surface-light/20">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-touch">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Camera className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="font-display font-semibold text-text-dominant">Sewa Kamera Ryox</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/cameras"
              className="font-text text-text-secondary hover:text-primary transition-colors"
            >
              Katalog
            </Link>

            {user ? (
              <>
                {profile?.role === 'admin' ? (
                  <Link
                    href="/admin"
                    className="font-text text-text-secondary hover:text-primary transition-colors"
                  >
                    Admin
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="font-text text-text-secondary hover:text-primary transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 font-text text-text-secondary hover:text-primary transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="font-text text-text-secondary hover:text-primary transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="h-touch px-6 bg-primary hover:bg-primary-hover text-white font-text rounded-button transition-colors"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-text-dominant hover:text-primary transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-surface-light/20">
            <div className="flex flex-col gap-4">
              <Link
                href="/cameras"
                className="font-text text-text-secondary hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Katalog
              </Link>

              {user ? (
                <>
                  {profile?.role === 'admin' ? (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 font-text text-text-secondary hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Admin
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 font-text text-text-secondary hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut();
                    }}
                    className="flex items-center gap-2 font-text text-text-secondary hover:text-primary transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 pt-4 border-t border-surface-light/20">
                  <Link
                    href="/login"
                    className="font-text text-text-secondary hover:text-primary transition-colors text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className="h-touch px-6 bg-primary hover:bg-primary-hover text-white font-text rounded-button transition-colors text-center"
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
    </nav>
  );
}
