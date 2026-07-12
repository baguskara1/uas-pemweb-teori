'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { BookingStatus } from '@/lib/constants';

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const supabase = await createClient();
  const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/bookings');
  revalidatePath(`/admin/bookings/${id}`);
  return { error: null };
}

export async function deleteBooking(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('bookings').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/bookings');
  return { error: null };
}
