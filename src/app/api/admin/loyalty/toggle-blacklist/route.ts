import { type NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { verifyAdmin } from '@/lib/admin-guard';

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin();
  if (!auth.allowed) return auth.response;

  try {
    const supabase = await createAdminClient();
    const { userId, blacklist } = await request.json();

    const { error } = await supabase
      .from('loyalty_cards')
      .update({ is_blacklisted: blacklist } as never)
      .eq('user_id', userId);

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
