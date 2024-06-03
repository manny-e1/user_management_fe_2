import ViewISecureNotePage from '@/components/pages/portal/isecure-notes/ViewDetail';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'i-Secure Note',
  description: 'View i-Secure note page for admin portal',
};

export default function ViewISecureNote() {
  return <ViewISecureNotePage />;
}
