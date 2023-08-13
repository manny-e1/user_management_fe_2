import EditUserPage from '@/components/pages/portal/users/edit/[id]/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User Management',
  description: 'Edit user page for user management portal',
};

export default function EditUser() {
  return <EditUserPage />;
}
