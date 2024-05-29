import RequestMFAConfigPage from '@/components/pages/portal/mfa-configurations/Request';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MFA Configuration',
  description: 'Request MFA configuration page for admin portal',
};

export default function RequestMFAConfiguration() {
  return <RequestMFAConfigPage />;
}
