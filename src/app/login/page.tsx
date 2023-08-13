import SigninPage from '@/components/pages/login';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in page for user management portal',
};

export default function Login() {
  return <SigninPage />;
}
