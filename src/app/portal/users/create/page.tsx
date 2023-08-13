import CreateUserPage from '@/components/pages/portal/users/create/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User Management',
  description: 'Add user page for user management portal',
};

export default function CreateUser() {
  return <CreateUserPage />;
}
