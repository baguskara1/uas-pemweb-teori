import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export type AdminGuardResult =
  | { allowed: true; userId: string }
  | { allowed: false; response: NextResponse };

export async function verifyAdmin(): Promise<AdminGuardResult> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return {
      allowed: false,
      response: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }),
    };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return {
      allowed: false,
      response: NextResponse.json({ message: 'Forbidden' }, { status: 403 }),
    };
  }

  return { allowed: true, userId: user.id };
}
