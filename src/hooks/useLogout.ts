import { logoutUser } from '@/service/user';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';

export function useLogout(router: AppRouterInstance) {
  const logoutMut = useMutation({
    mutationFn: logoutUser,
    onSuccess: (data) => {
      if ('message' in data && data.message === 'success') {
        Cookies.remove('user');
        sessionStorage.clear();
        Cookies.remove('rememberMe');
        router.push('/login');
      }
    },
  });
  return logoutMut;
}
