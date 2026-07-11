'use client';

import { Filter, Search } from 'lucide-react';
import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';

const STATUS_FILTERS = ['all', 'pending', 'paid', 'failed', 'expired'] as const;

type Payment = {
  id: string;
  booking_id: string;
  amount: number;
  status: string;
  method: string;
  paid_at: string | null;
  created_at: string;
};

export default function AdminPaymentsPage() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [payments] = useState<Payment[]>([]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-text-dominant">
            Riwayat Pembayaran
          </h1>
          <p className="font-text text-sm text-text-tertiary mt-1">
            Kelola dan pantau semua transaksi pembayaran
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-black/10 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
            <input
              type="text"
              placeholder="Cari berdasarkan ID booking atau payment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-black/15 bg-white text-text-dominant font-text text-sm focus:outline-none focus:border-primary"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-4 w-4 text-text-tertiary" />
            <div className="flex gap-2">
              {STATUS_FILTERS.map((status) => {
                const isActive = filterStatus === status;
                const label = status === 'all' ? 'Semua' : status;
                return (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg font-text text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'bg-surface-dark text-text-tertiary hover:bg-surface-light'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl border border-black/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full font-text text-sm">
            <thead className="bg-surface-dark text-text-tertiary">
              <tr>
                {['ID Payment', 'Booking', 'Jumlah', 'Metode', 'Status', 'Waktu'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-black/5 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-text-secondary">{payment.id}</td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-text-dominant">{payment.booking_id}</span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-green-700">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="px-6 py-4 capitalize text-text-secondary">
                    {payment.method.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        payment.status === 'paid'
                          ? 'bg-green-50 text-green-700'
                          : payment.status === 'failed'
                            ? 'bg-red-50 text-red-700'
                            : payment.status === 'pending'
                              ? 'bg-yellow-50 text-yellow-700'
                              : 'bg-surface-light text-text-tertiary'
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-secondary whitespace-nowrap">
                    {payment.paid_at
                      ? new Date(payment.paid_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '-'}
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-tertiary">
                    Tidak ada pembayaran
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
