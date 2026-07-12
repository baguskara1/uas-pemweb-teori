import { type NextRequest, NextResponse } from 'next/server';
import { withRateLimit } from '@/lib/rate-limit';
import { createClient } from '@/lib/supabase/server';

async function getWishlists() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('wishlists')
    .select('id, camera_id, created_at, camera:cameras(name, brand, image_url, price_per_day)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  return NextResponse.json({ data });
}

async function addWishlist(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { cameraId } = await request.json();
  if (!cameraId) return NextResponse.json({ error: 'cameraId required' }, { status: 400 });

  const { data, error } = await supabase
    .from('wishlists')
    .insert({ user_id: user.id, camera_id: cameraId })
    .select()
    .single();

  if (error) return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}

async function removeWishlist(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const cameraId = request.nextUrl.searchParams.get('cameraId');
  if (!cameraId) return NextResponse.json({ error: 'cameraId required' }, { status: 400 });

  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('user_id', user.id)
    .eq('camera_id', cameraId);

  if (error) return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 });
  return NextResponse.json({ success: true });
}

export const GET = withRateLimit(getWishlists);
export const POST = withRateLimit(addWishlist);
export const DELETE = withRateLimit(removeWishlist);
