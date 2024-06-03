import { getUsers } from '@/service/user';
import { useQuery } from '@tanstack/react-query';

export function useUsersQuery() {
  const getGroupsQry = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    refetchOnWindowFocus: false,
  });
  return getGroupsQry;
}
