import { checkPasswordValidity } from '@/service/password-history';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Swal from 'sweetalert2';

export function usePwdValidityQuery(id?: string) {
  const router = useRouter();
  const checkPwdValidityQry = useQuery({
    queryKey: ['passwordValidity'],
    queryFn: async () => checkPasswordValidity(id!),
    enabled: id !== undefined,
    staleTime: 60 * 1000,
  });
  useEffect(() => {
    if (
      checkPwdValidityQry.data?.error &&
      checkPwdValidityQry.data.error.includes('60 days')
    ) {
      Swal.fire({
        title: 'Error!',
        text: checkPwdValidityQry.data.error,
        icon: 'error',
      }).then(() => router.push('/portal/change-password'));
    }
  }, [checkPwdValidityQry.data]);
}
