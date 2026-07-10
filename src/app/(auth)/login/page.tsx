'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useState } from 'react';

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
    <div className="min-h-screen flex items-center justify-center bg-[#161616] px-4 text-white">
      <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-semibold text-white mb-2">Masuk</h1>
          <p className="font-text text-white/60">Masuk ke akun Sewa Kamera Ryox Anda</p>
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
              className="block font-text text-xs font-semibold text-white mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-touch px-4 font-text text-white bg-white/5 border border-white/10 rounded-input focus:outline-none focus:border-[#FDD26E] focus:ring-3 focus:ring-[#FDD26E]/10 transition-colors"
              placeholder="nama@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-text text-xs font-semibold text-white mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-touch px-4 font-text text-white bg-white/5 border border-white/10 rounded-input focus:outline-none focus:border-[#FDD26E] focus:ring-3 focus:ring-[#FDD26E]/10 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-touch bg-[#FDD26E] hover:bg-[#FED590] active:bg-[#FCC840] text-[#332A16] font-text rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="font-text text-white/60">
            Belum punya akun?{' '}
            <Link
              href="/register"
              className="text-[#FDD26E] hover:text-[#FED590] font-semibold transition-colors"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="font-text text-sm text-white/45 hover:text-[#FDD26E] transition-colors"
          >
            ← Kembali ke beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
