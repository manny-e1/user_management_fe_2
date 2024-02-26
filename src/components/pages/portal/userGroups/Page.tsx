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
import { SortingState } from '@tanstack/react-table';
import * as XLSX from 'xlsx';

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

  const handleExport = (sorting?: SortingState) => {
    const rows: any[] = [];
    const sortField = sorting?.length ? sorting[0].id : '';
    const sortDesc = (sorting?.length ? sorting[0].desc : false) == false ? 1 : -1;
    const topColumnNames: any[] = ['No.#', 'Group Name', 'Role'];

    console.log(sortField, sortDesc);
    
    let data:UserGroup[] = [];
    if (userGroups) {
      data = userGroups.sort((a: UserGroup, b: UserGroup) => {
        if (sortField === 'idx')  return a.idx - b.idx;
        else if (sortField === 'name')
          return a.name.localeCompare(b.name) * sortDesc;
        else if (sortField === 'role')
          return a.role.localeCompare(b.role) * sortDesc;
        else return 1;
      });
    }

    data.forEach((row) => {
      const rowData: any = [];
      rowData.push(row.idx);
      rowData.push(row.name);
      rowData.push(row.role);
      rows.push(rowData);
    });

    const newData = [topColumnNames, ...rows];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(newData, {
      skipHeader: true,
    });
    XLSX.utils.book_append_sheet(wb, ws, 'MySheet');
    XLSX.writeFile(wb, 'Users.xlsx');
  }

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
          onClick={handleExport}
        />
      </Section>
    </div>
  );
}
