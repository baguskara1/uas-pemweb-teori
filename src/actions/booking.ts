'use server';

import { createClient } from '@/lib/supabase/server';

export type CreateBookingResult = {
  success: boolean;
  data?: {
    id: string;
    final_price: number;
    discount_applied: boolean;
  };
  error?: string;
};

export async function createBooking(formData: {
  camera_id: string;
  start_date: string;
  end_date: string;
  duration: number;
  total_price: number;
}): Promise<CreateBookingResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  const { data, error } = await supabase.rpc('create_booking_with_loyalty', {
    p_camera_id: formData.camera_id,
    p_start_date: formData.start_date,
    p_end_date: formData.end_date,
    p_duration: formData.duration,
    p_total_price: formData.total_price,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  const booking = data?.[0];

  if (!booking) {
    return { success: false, error: 'Booking gagal dibuat' };
  }

  return {
    success: true,
    data: {
      id: booking.booking_id,
      final_price: booking.final_price,
      discount_applied: booking.discount_applied,
    },
  };
}

export async function markBookingCompleted(bookingId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Unauthorized' };

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'completed' })
    .eq('id', bookingId)
    .eq('user_id', user.id);

  if (error) return { success: false, error: error.message };

  return { success: true };
}
