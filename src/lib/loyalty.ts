import { createClient } from '@/lib/supabase/server';

export async function getLoyaltyCard(userId: string) {
  const supabase = await createClient();
  const { data: raw } = await supabase
    .from('loyalty_cards')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  return raw as unknown as Record<string, unknown> | null;
}

export async function canUserRent(userId: string): Promise<{ allowed: boolean; reason?: string }> {
  const supabase = await createClient();
  const { data: raw } = await supabase
    .from('loyalty_cards')
    .select('is_blacklisted, is_active')
    .eq('user_id', userId)
    .maybeSingle();

  const card = raw as unknown as { is_blacklisted: boolean; is_active: boolean } | null;

  if (!card) {
    return { allowed: true };
  }

  if (card.is_blacklisted) {
    return { allowed: false, reason: 'Akun Anda telah diblacklist. Hubungi admin untuk informasi lebih lanjut.' };
  }

  return { allowed: true };
}
