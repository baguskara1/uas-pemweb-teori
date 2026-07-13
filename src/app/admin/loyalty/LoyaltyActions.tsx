'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type CardData = {
  id: string;
  user_id: string;
  is_blacklisted: boolean;
  is_active: boolean;
};

export function LoyaltyActions({ card }: { card: CardData }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const toggleBlacklist = async () => {
    if (!confirm(`${card.is_blacklisted ? 'Unblacklist' : 'Blacklist'} user ini?`)) return;
    setLoading('blacklist');
    try {
      await fetch('/api/admin/loyalty/toggle-blacklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: card.user_id, blacklist: !card.is_blacklisted }),
      });
      router.refresh();
    } catch {
      alert('Gagal');
    } finally {
      setLoading(null);
    }
  };

  const toggleActive = async () => {
    setLoading('active');
    try {
      await fetch('/api/admin/loyalty/toggle-active', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: card.user_id, active: !card.is_active }),
      });
      router.refresh();
    } catch {
      alert('Gagal');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        type="button"
        onClick={toggleActive}
        disabled={loading !== null}
        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-surface-dark hover:bg-black/10 transition-colors disabled:opacity-50"
      >
        {loading === 'active' ? '...' : card.is_active ? 'Nonaktifkan' : 'Aktifkan'}
      </button>
      <button
        type="button"
        onClick={toggleBlacklist}
        disabled={loading !== null}
        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
          card.is_blacklisted
            ? 'bg-green-50 text-green-700 hover:bg-green-100'
            : 'bg-red-50 text-red-700 hover:bg-red-100'
        }`}
      >
        {loading === 'blacklist' ? '...' : card.is_blacklisted ? 'Unblacklist' : 'Blacklist'}
      </button>
    </div>
  );
}
