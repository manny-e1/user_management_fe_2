import SetPasswordPage from '@/components/pages/set-password/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Set Password',
  description: 'Set Password page for user management portal',
};
export default function SetPassword() {
  return <SetPasswordPage />;
}
