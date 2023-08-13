'use client';

import { useSessionTimeout } from '@/hooks/useSessionTimeout';

export function SessionTimeout() {
  useSessionTimeout();
  return null;
}
