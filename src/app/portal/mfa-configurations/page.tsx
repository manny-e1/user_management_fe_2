import MFAConfigurationPage from '@/components/pages/portal/mfa-configurations/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MFA Configuration',
  description: 'MFA Configuration list page for admin portal',
};

export default function MFAConfiguration() {
  return <MFAConfigurationPage />;
}
