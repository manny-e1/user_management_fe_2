import UserGroupsPage from '@/components/pages/portal/userGroups/Page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Group and Role',
  description: 'Group list page for user management portal',
};

export default function UserGroups() {
  return <UserGroupsPage />;
}
