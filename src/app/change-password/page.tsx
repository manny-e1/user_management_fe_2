import ChangePasswordPage from '@/components/pages/change-password/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Change Password',
  description: 'Change password page for user management',
};

export default function ChangePassword() {
  return <ChangePasswordPage />;
}
