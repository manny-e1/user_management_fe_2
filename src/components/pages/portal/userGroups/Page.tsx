'use client';
import BreadCrumbs from '@/components/BreadCrumbs';
import GroupTable from '@/components/tanstack-table/GroupTable';
import Section from '@/components/Section';
import { usePermission } from '@/hooks/usePermission';
import { useUserGroupsQuery } from '@/hooks/useUserGroupsQuery';
import { useRouter } from 'next/navigation';
import { usePwdValidityQuery } from '@/hooks/useCheckPwdValidityQuery';
// import Modal from '@/components/Modal';
import { UserGroup } from '@/service/user-group';

export default function UserGroupsPage() {
  const user = usePermission();
  const router = useRouter();
  // const [error, setError] = useState<string | null>(null);
  usePwdValidityQuery(user?.id);
  const getGroupsQry = useUserGroupsQuery();

  if (getGroupsQry.data && 'error' in getGroupsQry.data) {
    return <div>{getGroupsQry.data.error}</div>;
  }
  const userGroups: UserGroup[] | undefined = getGroupsQry.data?.userGroups;

  const breadCrumbs = [
    { name: 'MANAGEMENT' },
    { name: 'Admin Management' },
    { name: 'Group and Role' },
  ];
  return (
    <div className="p-4 no-scrollbar">
      <BreadCrumbs breadCrumbs={breadCrumbs} />
      <Section
        outerTitle="Group and Role Maintenance"
        innerTitle="User Group Listing"
      >
        <GroupTable
          {...{
            data: !userGroups || getGroupsQry.isFetching ? [] : userGroups,
          }}
        />
      </Section>
    </div>
  );
}
