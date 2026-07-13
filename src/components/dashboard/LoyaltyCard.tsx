import { Gift, History, Sparkles } from 'lucide-react';

type LoyaltyHistoryItem = {
  id: string;
  count_before: number;
  count_after: number;
  discount_applied: boolean;
  discount_amount: number;
  created_at: string;
};

type LoyaltyCardProps = {
  loyaltyCard: {
    current_count: number;
    max_count: number;
    discount_percent: number;
  } | null;
  history: LoyaltyHistoryItem[];
};

export function LoyaltyCard({ loyaltyCard, history }: LoyaltyCardProps) {
  const currentCount = loyaltyCard?.current_count ?? 0;
  const maxCount = loyaltyCard?.max_count ?? 3;
  const discountPercent = loyaltyCard?.discount_percent ?? 15;
  const progress = Math.min((currentCount / maxCount) * 100, 100);
  const isReady = currentCount >= maxCount;

  const formatCurrency = (value: number) => `Rp ${Math.round(value).toLocaleString('id-ID')}`;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-2xl border border-surface-light p-6 shadow-sm">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Gift className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">Loyalty Card</h2>
            </div>
            <p className="text-sm text-text-tertiary">
              Kumpulkan {maxCount} booking selesai untuk diskon {discountPercent}%.
            </p>
          </div>
          {isReady && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3 w-3" />
              Diskon Siap
            </span>
          )}
        </div>

        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="font-display text-4xl font-semibold">
              {currentCount}/{maxCount}
            </p>
            <p className="text-sm text-text-tertiary">Progress booking selesai</p>
          </div>
          <p className="text-sm font-semibold text-primary">
            {isReady
              ? 'Dipakai otomatis saat booking berikutnya'
              : `${maxCount - currentCount} lagi`}
          </p>
        </div>

        <div className="h-4 overflow-hidden rounded-full bg-surface-light">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-surface-light p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <History className="h-5 w-5 text-primary" />
          <h2 className="font-display text-xl font-semibold">Riwayat Diskon</h2>
        </div>

        {history.length > 0 ? (
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="rounded-xl bg-surface-light/40 p-3">
                <div className="flex justify-between text-sm font-medium">
                  <span>{item.discount_applied ? 'Diskon dipakai' : 'Progress bertambah'}</span>
                  <span>
                    {item.count_after}/{maxCount}
                  </span>
                </div>
                <p className="mt-1 text-xs text-text-tertiary">
                  {formatDate(item.created_at)}
                  {item.discount_amount > 0 && ` • ${formatCurrency(item.discount_amount)}`}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-tertiary">Belum ada riwayat loyalty.</p>
        )}
      </div>
    </section>
  );
}
