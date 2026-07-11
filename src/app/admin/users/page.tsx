'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type User = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: string;
  avatar_url: string | null;
  created_at: string;
};

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  const supabase = createClient();

  async function _fetchUsers() {
    let query = supabase
      .from('profiles')
      .select(`id, full_name, email, phone, role, avatar_url, created_at`)
      .order('created_at', { ascending: false });

    if (searchQuery.trim()) {
      query = query.or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
    }

    const { data } = await query;

    if (data && Array.isArray(data)) {
      setUsers(data as unknown as User[]);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-text-dominant">
            Manajemen Pengguna
          </h1>
          <p className="font-text text-sm text-text-tertiary mt-1">
            Kelola dan pantau semua pengguna sistem
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-black/10 p-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-black/15 bg-white text-text-dominant font-text text-sm focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-black/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full font-text text-sm">
            <thead className="bg-surface-dark text-text-tertiary">
              <tr>
                {['Nama', 'Email', 'Telepon', 'Role', 'Didaftarkan'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-black/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.full_name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="font-medium text-primary">
                            {user.full_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-text-dominant">{user.full_name}</div>
                        <div className="text-xs text-text-tertiary">{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-secondary">{user.email}</td>
                  <td className="px-6 py-4 text-text-secondary">{user.phone || '-'}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'admin'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-surface-dark text-text-secondary'
                      }`}
                    >
                      {user.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-secondary whitespace-nowrap">
                    {new Date(user.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-text-tertiary">
                    Tidak ada pengguna
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
