'use client';
import { usePermission } from '@/hooks/usePermission';
import { useEffect } from 'react';

export default function Home() {
  usePermission();
  return null;
}
