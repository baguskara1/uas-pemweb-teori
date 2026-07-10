import { LoyaltyCard } from '@/components/dashboard/LoyaltyCard';
import { createClient } from '@/lib/supabase/server';
import { BookOpen, CheckCircle2, Clock } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: bookings } = await supabase
    .from('bookings')
    .select('status')
    .eq('user_id', user.id);

  const { data: loyaltyCard } = await supabase
    .from('loyalty_cards')
    .select('id, current_count, max_count, discount_percent')
    .eq('user_id', user.id)
    .maybeSingle();

  const { data: loyaltyHistory } = loyaltyCard
    ? await supabase
        .from('loyalty_history')
        .select('id, count_before, count_after, discount_applied, discount_amount, created_at')
        .eq('loyalty_card_id', loyaltyCard.id)
        .order('created_at', { ascending: false })
        .limit(5)
    : { data: [] };

  const stats = {
    total: bookings?.length || 0,
    pending: bookings?.filter((b) => b.status === 'pending').length || 0,
    completed: bookings?.filter((b) => b.status === 'completed').length || 0,
  };

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Booking', value: stats.total, icon: BookOpen },
          { label: 'Menunggu', value: stats.pending, icon: Clock },
          { label: 'Selesai', value: stats.completed, icon: CheckCircle2 },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6 rounded-2xl border border-surface-light shadow-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="font-text text-sm text-text-tertiary">{stat.label}</span>
              <stat.icon className="h-5 w-5 text-primary" />
            </div>
            <p className="font-display text-3xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      <LoyaltyCard loyaltyCard={loyaltyCard} history={loyaltyHistory || []} />
    </div>
  );
}
