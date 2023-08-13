import { getUserGroups } from '@/service/user-group';
import { useQuery } from '@tanstack/react-query';

export function useUserGroupsQuery() {
  const getGroupsQry = useQuery({
    queryKey: ['userGroups'],
    queryFn: getUserGroups,
    refetchOnWindowFocus: false,
  });
  return getGroupsQry;
}
