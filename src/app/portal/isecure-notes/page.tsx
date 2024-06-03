import ISecureNotePage from '@/components/pages/portal/isecure-notes/Home';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'i-Secure Notes',
  description: 'i-Secure notes list page for admin portal',
};

export default function ISecureNote() {
  return <ISecureNotePage />;
}
