'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';

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
    <div className="max-w-xl text-text-dominant">
      <h1 className="font-display text-3xl font-semibold mb-8">Profil Saya</h1>
      <form
        onSubmit={updateProfile}
        className="space-y-6 bg-white p-8 rounded-2xl border border-black/10"
      >
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Nama Lengkap</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-input border border-black/15 bg-white px-4 py-2 text-text-dominant focus:outline-none focus:border-primary"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-primary-hover transition-colors"
        >
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </form>
    </div>
  );
}
