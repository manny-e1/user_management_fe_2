'use client';
import BreadCrumbs from '@/components/BreadCrumbs';
import Section from '@/components/Section';
import UserForm from '@/components/UserForm';
import { usePermission } from '@/hooks/usePermission';
import { useUserGroupsQuery } from '@/hooks/useUserGroupsQuery';

export default function CreateUserPage() {
  usePermission();
  const userGroupQry = useUserGroupsQuery();
  if (userGroupQry.data && 'error' in userGroupQry.data) {
    return <div>{userGroupQry.data.error}</div>;
  }
  const userGroups = userGroupQry.data?.userGroups;
  const breadCrumbs = [
    { name: 'MANAGEMENT' },
    { name: 'Admin Management' },
    { name: 'User Management' },
  ];
  return (
    <div className="p-4">
      <BreadCrumbs breadCrumbs={breadCrumbs} />
      <Section outerTitle="User Management" innerTitle="Create User">
        <UserForm edit={false} userGroups={userGroups} />
      </Section>
    </div>
  );
}
