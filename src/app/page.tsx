'use client';

import { usePermission } from '@/hooks/usePermission';

export default function Home() {
  usePermission();
  return <></>;
}
