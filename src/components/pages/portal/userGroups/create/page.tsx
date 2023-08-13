'use client';
import BreadCrumbs from '@/components/BreadCrumbs';
import Section from '@/components/Section';
import GroupForm from '@/components/GroupForm';
import { usePermission } from '@/hooks/usePermission';
import { useRolesQuery } from '@/hooks/useRolesQuery';

export default function CreateUserGroupPage() {
  usePermission();
  const roleQry = useRolesQuery();
  if (roleQry.data && 'error' in roleQry.data) {
    return <div>{roleQry.data.error}</div>;
  }
  const roles = roleQry.data?.roles;
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
        innerTitle="Create User Group"
      >
        <GroupForm edit={false} roles={roles} />
      </Section>
    </div>
  );
}
