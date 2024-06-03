import RequestISecureNotePage from '@/components/pages/portal/isecure-notes/Request';
import RequestMFAConfigPage from '@/components/pages/portal/mfa-configurations/Request';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'i-Secure Notes',
  description: 'Request i-Secure notes page for admin portal',
};

export default function RequestISecureNote() {
  return <RequestISecureNotePage />;
}
