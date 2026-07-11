'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-dark px-4 text-text-dominant">
      <div className="w-full max-w-md bg-white border border-black/10 p-8 rounded-3xl">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-semibold text-text-dominant mb-2">Masuk</h1>
          <p className="font-text text-text-tertiary">Masuk ke akun Sewa Kamera Ryox Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-input p-4">
              <p className="text-sm text-rose-300">{error}</p>
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block font-text text-xs font-semibold text-text-dominant mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-touch px-4 font-text text-text-dominant bg-white border border-black/15 rounded-input focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10 transition-colors"
              placeholder="nama@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-text text-xs font-semibold text-text-dominant mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-touch px-4 font-text text-text-dominant bg-white border border-black/15 rounded-input focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-touch bg-primary hover:bg-primary-hover active:bg-primary-press text-white font-text rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="font-text text-text-tertiary">
            Belum punya akun?{' '}
            <Link
              href="/register"
              className="text-primary hover:text-primary-hover font-semibold transition-colors"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="font-text text-sm text-text-tertiary hover:text-primary transition-colors"
          >
            ← Kembali ke beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
