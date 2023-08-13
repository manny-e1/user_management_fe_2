import { Role } from '@/service/role';
import { User } from '@/service/user';
import Cookies from 'js-cookie';
import { redirect, usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useState } from 'react';

export function usePermission() {
  const pathname = usePathname();
  const rememberMe = Cookies.get('rememberMe');
  const [user, setUser] = useState<
    (User & { token: string; role: Role }) | undefined
  >();
  useLayoutEffect(() => {
    let data =
      rememberMe === 'yes'
        ? Cookies.get('user')
        : sessionStorage.getItem('user');
    data = data === null ? undefined : data;
    const usr: (User & { token: string; role: Role }) | undefined =
      data === undefined ? undefined : JSON.parse(data);
    // const usr: (User & { token: string; role: Role }) | undefined =
    //   data === undefined ? JSON.parse("{'role':'admin', 'token': ''}") : JSON.parse(data);
    setUser(usr);
    if (usr) {
      const role = usr.role;
      if (pathname === '/login' || pathname === '/') {
        switch (role) {
          case 'admin':
            redirect('/portal/users');
          case 'admin 2':
            redirect('/portal/user-groups');
          case 'manager 1':
          case 'normal user 1':
            redirect('/portal/transaction-limit');
          case 'manager 2':
          case 'normal user 2':
            redirect('/portal/system-maintenance');
          default:
            redirect('/portal/change-password');
        }
      } else if (pathname?.includes('/users')) {
        switch (role) {
          case 'admin':
            return;
          case 'admin 2':
            redirect('/portal/user-groups');
          case 'manager 1':
          case 'normal user 1':
            redirect('/portal/transaction-limit');
          case 'manager 1':
          case 'normal user 1':
            redirect('/portal/system-maintenance');
          default:
            redirect('/portal/change-password');
        }
      } else if (pathname?.includes('/user-groups')) {
        switch (role) {
          case 'admin':
          case 'admin 2':
            return;
          case 'manager 1':
          case 'normal user 1':
            redirect('/portal/transaction-limit');
          default:
            redirect('/portal/change-password');
        }
      } else if (pathname?.includes('/transaction-limit')) {
        switch (role) {
          case 'admin':
            redirect('/portal/users');
          case 'admin 2':
            redirect('/portal/user-groups');
          case 'manager 1':
          case 'normal user 1':
            return;
          case 'manager 2':
          case 'normal user 2':
            redirect('/portal/system-maintenance');
          default:
            redirect('/portal/change-password');
        }
      }
    } else if (
      !usr &&
      pathname !== '/login' &&
      (pathname === '/' || pathname?.startsWith('/portal'))
    ) {
      redirect('/login');
    }
  }, [user?.role]);
  return user;
}
