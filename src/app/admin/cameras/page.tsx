import { CamerasTable } from '@/components/admin/CamerasTable';
import { createClient } from '@/lib/supabase/server';

export default async function AdminCamerasPage() {
  const supabase = await createClient();
  const { data: cameras } = await supabase
    .from('cameras')
    .select('id, name, brand, type, description, price_per_day, stock, is_available, image_url')
    .order('created_at', { ascending: false });

  return <CamerasTable cameras={cameras ?? []} />;
}
