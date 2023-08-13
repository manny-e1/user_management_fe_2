'use client';
import BreadCrumbs from '@/components/BreadCrumbs';
import Section from '@/components/Section';
import GroupForm from '@/components/GroupForm';
import { getUserGroupById } from '@/service/user-group';
import { useQuery } from '@tanstack/react-query';
import { usePermission } from '@/hooks/usePermission';
import { useRolesQuery } from '@/hooks/useRolesQuery';
import { useParams } from 'next/navigation';

export default function EditUserGroupPage() {
  usePermission();
  const params = useParams();
  const userGroupQry = useQuery({
    queryKey: ['userGroup', params?.id],
    queryFn: async () => getUserGroupById(params?.id as string),
    enabled: !!params?.id,
    refetchOnWindowFocus: false,
  });
  const rolesQry = useRolesQuery();
  if (userGroupQry.data && 'error' in userGroupQry.data) {
    return <div>{userGroupQry.data.error}</div>;
  }
  if (rolesQry.data && 'error' in rolesQry.data) {
    return <div>{rolesQry.data.error}</div>;
  }
  const userGroup = userGroupQry.data?.userGroup;
  const roles = rolesQry.data?.roles;
  const breadCrumbs = [
    { name: 'MANAGEMENT' },
    { name: 'Admin Management' },
    { name: 'Group and Role' },
  ];
  return (
    <div className="p-4">
      <BreadCrumbs breadCrumbs={breadCrumbs} />
      <Section
        outerTitle="Group and Role Maintenance"
        innerTitle="Edit User Group"
      >
        <GroupForm edit={true} group={userGroup} roles={roles} />
      </Section>
    </div>
  );
}
