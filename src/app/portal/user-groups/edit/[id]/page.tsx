import EditUserGroupPage from '@/components/pages/portal/userGroups/edit/[id]/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Group and Role',
  description: 'Edit Group page for user management portal',
};

export default function EditUserGroup() {
  return <EditUserGroupPage />;
}
