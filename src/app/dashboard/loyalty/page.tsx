'use client';

import { CreditCard, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/lib/utils';

type LoyaltyCardData = {
  id: string;
  current_count: number;
  max_count: number;
  discount_percent: number;
  total_rentals: number;
  is_active: boolean;
  is_blacklisted: boolean;
};

export default function LoyaltyPage() {
  const { user } = useAuth();
  const [card, setCard] = useState<LoyaltyCardData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch('/api/loyalty/card');
      const json = await res.json();
      if (json.success) setCard(json.data as LoyaltyCardData);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const progressPercent = card ? Math.min((card.current_count / card.max_count) * 100, 100) : 0;

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="font-display text-3xl font-semibold">Loyalty Card</h1>
        <p className="font-text text-text-tertiary mt-1">
          Dapatkan diskon setelah beberapa kali penyewaan
        </p>
      </div>

      {/* Loyalty Progress */}
      <div className="bg-white rounded-2xl border border-black/10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold">Status Loyalitas</h2>
            <p className="font-text text-xs text-text-tertiary">
              Dapatkan diskon {card?.discount_percent || 15}% setelah {card?.max_count || 3}x penyewaan
            </p>
          </div>
        </div>

        <div className="bg-surface-dark rounded-xl p-5">
          <div className="flex justify-between items-baseline mb-2">
            <span className="font-text text-sm text-text-tertiary">Progres</span>
            <span className="font-display text-lg font-semibold">
              {card?.current_count || 0} / {card?.max_count || 3}
            </span>
          </div>
          <div className="w-full bg-black/5 rounded-full h-3 mb-3">
            <div
              className="bg-amber-500 rounded-full h-3 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between font-text text-xs text-text-tertiary">
            <span>Total penyewaan: {card?.total_rentals || 0}</span>
            {progressPercent >= 100 && (
              <span className="text-amber-600 font-semibold">Diskon siap digunakan!</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
