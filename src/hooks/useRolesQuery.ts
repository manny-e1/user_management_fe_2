import { getRoles } from '@/service/role';
import { useQuery } from '@tanstack/react-query';

export function useRolesQuery() {
  const rolesQry = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
    refetchOnWindowFocus: false,
  });
  return rolesQry;
}
