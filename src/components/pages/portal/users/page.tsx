'use client';
import BreadCrumbs from '@/components/BreadCrumbs';
import { User, getUsers } from '@/service/user';
import UserTable from '@/components/tanstack-table/UserTable';
import Section from '@/components/Section';
import { useQuery } from '@tanstack/react-query';
import { usePermission } from '@/hooks/usePermission';
import { usePwdValidityQuery } from '@/hooks/useCheckPwdValidityQuery';
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
  return (
    <div className="p-4 no-scrollbar">
      <BreadCrumbs breadCrumbs={breadCrumbs} />
      <Section outerTitle="User Management" innerTitle="User Listing">
        <UserTable
          {...{
            data: !users || usersQry.isFetching ? [] : users,
          }}
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
