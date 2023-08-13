import ChangePasswordPortalPage from '@/components/pages/portal/change-password/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Change Password',
  description: 'Change password page for user management portal',
};

export default function ChangePassword() {
  return <ChangePasswordPortalPage />;
}
