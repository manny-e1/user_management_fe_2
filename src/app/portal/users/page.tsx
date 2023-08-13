import UsersPage from '@/components/pages/portal/users/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User Management',
  description: 'Users list page for user management portal',
};

export default function Users() {
  return <UsersPage />;
}
