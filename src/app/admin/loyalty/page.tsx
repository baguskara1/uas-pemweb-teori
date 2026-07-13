import { Shield, ShieldOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { LoyaltyActions } from './LoyaltyActions';

export const dynamic = 'force-dynamic';

export default async function AdminLoyaltyPage() {
  const supabase = await createClient();

  const { data: cards } = await supabase
    .from('loyalty_cards')
    .select('*, profiles(full_name, email)')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
          <Shield className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold">Kelola Loyalty</h1>
          <p className="font-text text-sm text-text-tertiary mt-0.5">
            Atur status loyalty dan blacklist pengguna
          </p>
        </div>
      </div>

      {(!cards || cards.length === 0) ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-black/10">
          <Shield className="w-12 h-12 mx-auto text-black/20 mb-3" />
          <p className="font-text text-text-tertiary">Belum ada data loyalty card</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/10 bg-surface-dark">
                  <th className="text-left px-4 py-3 font-text text-xs font-semibold text-text-tertiary uppercase tracking-wider">User</th>
                  <th className="text-left px-4 py-3 font-text text-xs font-semibold text-text-tertiary uppercase tracking-wider">Email</th>
                  <th className="text-center px-4 py-3 font-text text-xs font-semibold text-text-tertiary uppercase tracking-wider">Status</th>
                  <th className="text-center px-4 py-3 font-text text-xs font-semibold text-text-tertiary uppercase tracking-wider">Blacklist</th>
                  <th className="text-center px-4 py-3 font-text text-xs font-semibold text-text-tertiary uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {cards.map((c) => {
                  const card = c as unknown as {
                    id: string;
                    user_id: string;
                    is_blacklisted: boolean;
                    is_active: boolean;
                    profiles: { full_name: string; email: string } | null;
                  };
                  return (
                    <tr key={card.id} className="border-b border-black/5 hover:bg-surface-dark/50 transition-colors">
                      <td className="px-4 py-3 font-text text-sm font-medium">
                        {card.profiles?.full_name || '-'}
                      </td>
                      <td className="px-4 py-3 font-text text-sm text-text-tertiary">
                        {card.profiles?.email || '-'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {card.is_active ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
                            <Shield className="w-3 h-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
                            <ShieldOff className="w-3 h-3" /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {card.is_blacklisted ? (
                          <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold">Yes</span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">No</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <LoyaltyActions card={card} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
