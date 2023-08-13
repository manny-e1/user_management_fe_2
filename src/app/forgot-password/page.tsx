import ForgotPasswordPage from '@/components/pages/forgot-password/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Forgot password page for user management portal',
};

export default function ForgotPassword() {
  return <ForgotPasswordPage />;
}
