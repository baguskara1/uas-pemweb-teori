import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { data: raw } = await supabase
      .from('loyalty_cards')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    return NextResponse.json({ success: true, data: raw ?? null });
  } catch (error) {
    console.error('[Loyalty Card] Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
