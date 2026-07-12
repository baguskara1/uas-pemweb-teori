import { type NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin-guard';
import { withRateLimit } from '@/lib/rate-limit';
import { createClient } from '@/lib/supabase/server';

async function getUsers(request: NextRequest) {
  const guard = await verifyAdmin();
  if (!guard.allowed) return guard.response;

  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const limit = Math.min(Number(searchParams.get('limit')) || 50, 200);
  const offset = Math.max(Number(searchParams.get('offset')) || 0, 0);

  let query = supabase
    .from('profiles')
    .select('id, full_name, email, phone, role, avatar_url, created_at')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    const escaped = search.replace(/[%_]/g, '\\$&');
    query = query.or(`full_name.ilike.%${escaped}%,email.ilike.%${escaped}%`);
  }

  const { data: users, error } = await query;

  if (error) {
    return NextResponse.json({ message: 'INTERNAL_ERROR' }, { status: 500 });
  }

  return NextResponse.json({ users, limit, offset });
}

export const GET = withRateLimit(getUsers);
