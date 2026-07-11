'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * Subscribes to realtime changes on the bookings table for a given user.
 * Triggers router.refresh() so server components re-fetch fresh data.
 */
export function useRealtimeBookings(userId: string | undefined) {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`bookings:user:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          router.refresh();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, router, supabase]);
}

/**
 * Subscribes to realtime changes on the cameras table (stock/availability).
 * Triggers router.refresh() so server components re-fetch fresh data.
 */
export function useRealtimeCameras() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel('cameras:availability')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'cameras',
        },
        () => {
          router.refresh();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router, supabase]);
}
