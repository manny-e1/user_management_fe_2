import CreateUserGroupPage from '@/components/pages/portal/userGroups/create/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Group and Role',
  description: 'Add Group page for user management portal',
};

export default function CreateUserGroup() {
  return <CreateUserGroupPage />;
}
