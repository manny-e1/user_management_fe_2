'use client';
import BreadCrumbs from '@/components/BreadCrumbs';
import { User, getUsers } from '@/service/user';
import UserTable from '@/components/tanstack-table/UserTable';
import Section from '@/components/Section';
import { useQuery } from '@tanstack/react-query';
import { usePermission } from '@/hooks/usePermission';
import { usePwdValidityQuery } from '@/hooks/useCheckPwdValidityQuery';
import { SortingState } from '@tanstack/react-table';

import * as XLSX from 'xlsx';
// import Modal from '@/components/Modal';

export default function UsersPage() {
  const user = usePermission();
  // const [error, setError] = useState<string | null>(null);
  usePwdValidityQuery(user?.id);
  const usersQry = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    refetchOnWindowFocus: false,
  });

  const breadCrumbs = [
    { name: 'MANAGEMENT' },
    { name: 'Admin Management' },
    { name: 'User Management' },
  ];
  if (usersQry.data && 'error' in usersQry.data) {
    return <div>{usersQry.data.error}</div>;
  }

  const users: User[] | undefined = usersQry.data?.users;

  const handleExport = (sorting?: SortingState) => {
    const rows: any[] = [];
    const sortField = sorting?.length ? sorting[0].id : '';
    const sortDesc = (sorting?.length ? sorting[0].desc : false) == false ? 1 : -1;
    const topColumnNames: any[] = ['No.#', 'Name', 'Email', 'Staff Id', 'User group', 'Status'];

    //console.log(sortField, sortDesc);
    
    let data:User[] = [];
    if (users) {
      data = users.sort((a: User, b: User) => {
        if (sortField === 'idx')  return a.idx - b.idx;
        else if (sortField === 'name')
          return a.name.localeCompare(b.name) * sortDesc;
        else if (sortField === 'email')
          return a.email.localeCompare(b.email) * sortDesc;
        else if (sortField === 'staffID')
          return a.staffId.localeCompare(b.staffId) * sortDesc;
        else if (sortField === 'userGroup')
          return a.userGroup.localeCompare(b.userGroup) * sortDesc;
        else if (sortField === 'status')
          return a.status.localeCompare(b.status) * sortDesc;
        else return 1;
      });
    }

    data.forEach((row) => {
      const rowData: any = [];
      rowData.push(row.idx);
      rowData.push(row.name);
      rowData.push(row.email);
      rowData.push(row.staffId);
      rowData.push(row.userGroup);
      rowData.push(row.status);
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

  return (
    <div className="p-4 no-scrollbar">
      <BreadCrumbs breadCrumbs={breadCrumbs} />
      <Section outerTitle="User Management" innerTitle="User Listing">
        <UserTable
          {...{
            data: !users || usersQry.isFetching ? [] : users,
          }}
          onClick={handleExport}
        />
      </Section>
      {/* {error && (
        <Modal
          error={true}
          message={error}
          onClick={() => router.push('/portal/change-password')}
        />
      )} */}
    </div>
  );
}
