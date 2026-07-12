'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/shared/Toast';

export default function ProfilePage() {
  const { profile } = useAuth();
  const supabase = createClient();
  const { show } = useToast();

  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, phone })
      .eq('id', profile.id);
    setLoading(false);
    if (error) {
      show('Gagal memperbarui profil: ' + error.message, 'error');
    } else {
      show('Profil berhasil diperbarui!', 'success');
    }
  };

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !currentPassword) {
      show('Isi semua field password', 'error');
      return;
    }
    if (newPassword.length < 6) {
      show('Password baru minimal 6 karakter', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      show('Konfirmasi password tidak cocok', 'error');
      return;
    }
    setPasswordLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: profile?.email || '',
      password: currentPassword,
    });
    if (signInError) {
      show('Password saat ini salah', 'error');
      setPasswordLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPasswordLoading(false);
    if (error) {
      show('Gagal mengubah password: ' + error.message, 'error');
    } else {
      show('Password berhasil diubah!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="max-w-xl text-text-dominant space-y-8">
      <h1 className="font-display text-3xl font-semibold">Profil Saya</h1>

      {/* Profile Info */}
      <form onSubmit={updateProfile} className="space-y-4 bg-white p-6 sm:p-8 rounded-2xl border border-black/10">
        <h2 className="font-display text-lg font-semibold mb-4">Data Diri</h2>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
          <input
            type="email"
            value={profile?.email || ''}
            disabled
            className="w-full rounded-input border border-black/10 bg-surface-dark px-4 py-2.5 text-text-tertiary cursor-not-allowed"
          />
          <p className="text-xs text-text-tertiary mt-1">Email tidak dapat diubah</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Nama Lengkap</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-input border border-black/15 bg-white px-4 py-2.5 text-text-dominant focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Nomor Telepon</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="08xxxxxxxxxx"
            className="w-full rounded-input border border-black/15 bg-white px-4 py-2.5 text-text-dominant focus:outline-none focus:border-primary"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white px-6 py-2.5 rounded-full font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50"
        >
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </form>

      {/* Password Change */}
      <form onSubmit={updatePassword} className="space-y-4 bg-white p-6 sm:p-8 rounded-2xl border border-black/10">
        <h2 className="font-display text-lg font-semibold mb-4">Ubah Password</h2>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Password Saat Ini</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-input border border-black/15 bg-white px-4 py-2.5 text-text-dominant focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Password Baru</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Minimal 6 karakter"
            className="w-full rounded-input border border-black/15 bg-white px-4 py-2.5 text-text-dominant focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Konfirmasi Password Baru</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-input border border-black/15 bg-white px-4 py-2.5 text-text-dominant focus:outline-none focus:border-primary"
          />
        </div>
        <button
          type="submit"
          disabled={passwordLoading}
          className="bg-primary text-white px-6 py-2.5 rounded-full font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50"
        >
          {passwordLoading ? 'Mengubah...' : 'Ubah Password'}
        </button>
      </form>
    </div>
  );
}
