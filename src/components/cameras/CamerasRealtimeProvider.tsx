'use client';

import { useRealtimeCameras } from '@/hooks/useRealtime';

export function CamerasRealtimeProvider({ children }: { children: React.ReactNode }) {
  useRealtimeCameras();
  return <>{children}</>;
}
