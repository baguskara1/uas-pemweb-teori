'use client';

import { Calendar, Mail, Phone, User } from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: string;
  avatar_url: string | null;
  created_at: string;
};

type Booking = {
  id: string;
  camera_name: string;
  camera_brand: string;
  camera_type: string;
  start_date: string;
  end_date: string;
  duration: number;
  total_price: number;
  status: string;
  created_at: string;
};

export default function AdminUserDetailPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const supabase = createClient();

  async function _fetchUserData() {
    const { data: profile } = await supabase
      .from('profiles')
      .select(`id, full_name, email, phone, role, avatar_url, created_at`)
      .eq('id', params.id)
      .single();

    if (profile) {
      setUser(profile as unknown as UserProfile);
    }

    const { data: userBookings } = await supabase
      .from('bookings')
      .select(`
        id,
        camera_id,
        start_date,
        end_date,
        duration,
        total_price,
        status,
        created_at,
        cameras (name, brand, type)
      `)
      .eq('user_id', params.id)
      .order('created_at', { ascending: false });

    if (userBookings && Array.isArray(userBookings)) {
      const formatted = userBookings.map((b) => ({
        id: b.id,
        camera_name: b.cameras?.name || '-',
        camera_brand: b.cameras?.brand || '-',
        camera_type: b.cameras?.type || '-',
        start_date: b.start_date,
        end_date: b.end_date,
        duration: b.duration,
        total_price: b.total_price,
        status: b.status,
        created_at: b.created_at,
      }));
      setBookings(formatted as unknown as Booking[]);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 mb-4"
        >
          ← Kembali
        </button>
        <h1 className="font-display text-3xl font-semibold text-text-dominant">Detail Pengguna</h1>
        <p className="font-text text-sm text-text-tertiary mt-1">
          Informasi lengkap dan history booking pengguna
        </p>
      </div>

      {user && (
        <>
          {/* User Profile Card */}
          <div className="bg-white rounded-xl border border-black/10 overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.full_name}
                    className="h-24 w-24 rounded-full object-cover border-4 border-surface-light"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-surface-light">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="font-display text-2xl font-semibold text-text-dominant">
                    {user.full_name}
                  </h2>
                  <p className="text-text-secondary mt-1">{user.email}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'admin'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-surface-dark text-text-secondary'
                      }`}
                    >
                      {user.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t border-black/10">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-text-tertiary mt-1" />
                  <div>
                    <p className="text-xs text-text-tertiary mb-1">Email</p>
                    <p className="text-sm font-medium text-text-dominant">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-text-tertiary mt-1" />
                  <div>
                    <p className="text-xs text-text-tertiary mb-1">Telepon</p>
                    <p className="text-sm font-medium text-text-dominant">{user.phone || '-'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-text-tertiary mt-1" />
                  <div>
                    <p className="text-xs text-text-tertiary mb-1">User ID</p>
                    <p className="text-sm font-medium font-mono text-text-dominant">{user.id}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-text-tertiary mt-1" />
                  <div>
                    <p className="text-xs text-text-tertiary mb-1">Didaftarkan</p>
                    <p className="text-sm font-medium text-text-dominant">
                      {new Date(user.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bookings History */}
          <div>
            <h3 className="font-display text-xl font-semibold mb-4 text-text-dominant">
              History Peminjaman
            </h3>
            <div className="bg-white rounded-xl border border-black/10 overflow-hidden">
              <table className="w-full font-text text-sm">
                <thead className="bg-surface-dark text-text-tertiary">
                  <tr>
                    {['Kamera', 'Tanggal Pinjam', 'Durasi', 'Total', 'Status'].map((h) => (
                      <th key={h} className="px-6 py-3 text-left font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-black/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-text-dominant">{booking.camera_name}</div>
                        <div className="text-xs text-text-tertiary">
                          {booking.camera_brand} • {booking.camera_type}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-text-secondary">
                        <div>{new Date(booking.start_date).toLocaleDateString('id-ID')}</div>
                        <div className="text-xs">
                          s/d {new Date(booking.end_date).toLocaleDateString('id-ID')}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-text-secondary">{booking.duration} hari</td>
                      <td className="px-6 py-4 text-text-secondary">
                        {`Rp ${Math.round(booking.total_price).toLocaleString('id-ID')}`}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                            booking.status === 'confirmed'
                              ? 'bg-green-50 text-green-700'
                              : booking.status === 'in_progress'
                                ? 'bg-blue-50 text-blue-700'
                                : booking.status === 'returned'
                                  ? 'bg-purple-50 text-purple-700'
                                  : booking.status === 'completed'
                                    ? 'bg-green-50 text-green-700'
                                    : booking.status === 'cancelled'
                                      ? 'bg-red-50 text-red-700'
                                      : 'bg-yellow-50 text-yellow-700'
                          }`}
                        >
                          {booking.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-text-tertiary">
                        Tidak ada history peminjaman
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
