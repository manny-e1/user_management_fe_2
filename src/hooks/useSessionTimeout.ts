import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useLogout } from './useLogout';
import { User } from '@/service/user';

export function useSessionTimeout() {
  const router = useRouter();
  const logoutMut = useLogout(router);
  useEffect(() => {
    const rememberMe = Cookies.get('rememberMe');
    if (!rememberMe || rememberMe === 'yes') {
      return;
    }
    let inactivityTimer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(logout, 1000 * 60 * 15);
    };

    const logout = () => {
      const user = sessionStorage.getItem('user');
      if (user) {
        const parsedUser: User = JSON.parse(user);
        logoutMut.mutate(parsedUser.id);
      }
    };

    const handleActivity = () => {
      sessionStorage.setItem('lastActivityTimestamp', Date.now().toString());
      resetTimer();
    };

    const handleKeyPress = () => {
      handleActivity();
    };

    const handleMouseMove = () => {
      handleActivity();
    };

    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('mousemove', handleMouseMove);

    const lastActivityTimestamp = sessionStorage.getItem(
      'lastActivityTimestamp'
    );
    if (lastActivityTimestamp) {
      const elapsed = Date.now() - parseInt(lastActivityTimestamp, 10);
      if (elapsed < 900000) {
        resetTimer();
      } else {
        logout();
      }
    } else {
      resetTimer();
    }

    // Clean up event listeners on unmount
    return () => {
      clearTimeout(inactivityTimer);
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
}
