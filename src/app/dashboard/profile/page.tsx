'use client';

import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';

export default function ProfilePage() {
  const { profile } = useAuth();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setLoading(true);
    await supabase.from('profiles').update({ full_name: fullName }).eq('id', profile.id);
    setLoading(false);
    alert('Profil diperbarui!');
  };

  return (
    <div className="max-w-xl text-white">
      <h1 className="font-display text-3xl font-semibold mb-8">Profil Saya</h1>
      <form
        onSubmit={updateProfile}
        className="space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10"
      >
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">Nama Lengkap</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-input border border-white/10 bg-[#161616] px-4 py-2 text-white focus:outline-none focus:border-[#FDD26E]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#FDD26E] text-[#332A16] px-6 py-2 rounded-full font-semibold hover:bg-[#FED590] transition-colors"
        >
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </form>
    </div>
  );
}
