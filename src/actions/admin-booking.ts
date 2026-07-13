'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import type { BookingStatus } from '@/lib/constants';
import type { Database } from '@/types/database';

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const supabase = await createClient();
  
  if (id.startsWith('group_')) {
    const orderGroup = id.replace('group_', '');
    const { error } = await supabase.from('bookings').update({ status }).eq('order_group', orderGroup);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
    if (error) return { error: error.message };
  }
  
  revalidatePath('/admin/bookings');
  revalidatePath(`/admin/bookings/${id}`);
  return { error: null };
}

export async function deleteBooking(id: string) {
  const supabase = createServiceClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SERVICE_ROLE_KEY!,
  );
  const { error } = await supabase.from('bookings').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/bookings');
  return { error: null };
}

export async function deleteMultipleBookings(ids: string[]) {
  if (ids.length === 0) return { error: 'Tidak ada booking yang dipilih' };
  const supabase = createServiceClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SERVICE_ROLE_KEY!,
  );
  
  const normalIds = ids.filter(id => !id.startsWith('group_'));
  const groupIds = ids.filter(id => id.startsWith('group_')).map(id => id.replace('group_', ''));
  
  if (normalIds.length > 0) {
    const { error } = await supabase.from('bookings').delete().in('id', normalIds);
    if (error) return { error: error.message };
  }
  
  if (groupIds.length > 0) {
    const { error } = await supabase.from('bookings').delete().in('order_group', groupIds);
    if (error) return { error: error.message };
  }
  
  revalidatePath('/admin/bookings');
  return { error: null };
}
