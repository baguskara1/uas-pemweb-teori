'use client';

import { useRealtimeBookings } from '@/hooks/useRealtime';

export function BookingsRealtimeProvider({
  userId,
  children,
}: {
  userId: string;
  children: React.ReactNode;
}) {
  useRealtimeBookings(userId);
  return <>{children}</>;
}
