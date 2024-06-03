import ViewMFAConfigPage from '@/components/pages/portal/mfa-configurations/ViewDetail';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MFA Configuration',
  description: 'View mfa configuration page for admin portal',
};

export default function ViewMFAConfig() {
  return <ViewMFAConfigPage />;
}
