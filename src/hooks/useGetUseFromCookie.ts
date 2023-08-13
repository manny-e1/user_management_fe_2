import { Role } from '@/service/role';
import { User } from '@/service/user';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

export function useGetUserFromCookie() {
  const [user, setUser] = useState<
    (User & { token: string; role: Role }) | undefined
  >(undefined);
  useEffect(() => {
    const rememberMe = Cookies.get('rememberMe');
    let data =
      rememberMe === 'yes'
        ? Cookies.get('user')
        : sessionStorage.getItem('user');
    data = data === null ? undefined : data;
    const usr: (User & { token: string; role: Role }) | undefined =
      data === undefined ? undefined : JSON.parse(data);
    setUser(usr);
  }, []);
  return user;
}
