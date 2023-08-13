'use client';
import BreadCrumbs from '@/components/BreadCrumbs';
import Section from '@/components/Section';
import UserForm from '@/components/UserForm';
import { usePermission } from '@/hooks/usePermission';
import { useUserGroupsQuery } from '@/hooks/useUserGroupsQuery';
import { getUserById } from '@/service/user';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export default function EditUserPage() {
  usePermission();
  const params = useParams();
  const userQry = useQuery({
    queryKey: ['user', params?.id],
    queryFn: async () => getUserById(params?.id as string),
    enabled: params?.id !== undefined,
    refetchOnWindowFocus: false,
  });
  const userGroupsQry = useUserGroupsQuery();
  if (userQry.data && 'error' in userQry.data) {
    return <div>{userQry.data.error}</div>;
  } else if (userGroupsQry.data && 'error' in userGroupsQry.data) {
    return <div>{userGroupsQry.data.error}</div>;
  }
  const user = userQry.data?.user;
  const userGroups = userGroupsQry.data?.userGroups;
  const breadCrumbs = [
    { name: 'MANAGEMENT' },
    { name: 'Admin Management' },
    { name: 'User Management' },
  ];
  return (
    <div className="p-4">
      <BreadCrumbs breadCrumbs={breadCrumbs} />
      <Section outerTitle="User Management" innerTitle="Edit User">
        <UserForm edit={true} user={user} userGroups={userGroups} />
      </Section>
    </div>
  );
}
