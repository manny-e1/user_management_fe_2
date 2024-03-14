'use client';
import { sidebarCollapseAtom } from '@/atoms';
import { Dropdown } from 'flowbite-react';
import { useSetAtom } from 'jotai';
import { HiOutlineMenuAlt2, HiOutlineLockClosed } from 'react-icons/hi';
import { VscSettings } from 'react-icons/vsc';
import { SlSettings } from 'react-icons/sl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useGetUserFromCookie } from '@/hooks/useGetUseFromCookie';
import { use, useLayoutEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { logoutUser } from '@/service/user';
import { data } from 'autoprefixer';
import { useLogout } from '@/hooks/useLogout';

function DropDownEmail({ email }: { email?: string }) {
  const [isSizeGreater, setIsSizeGreater] = useState(true);
  useLayoutEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 575) {
        setIsSizeGreater(true);
      } else {
        setIsSizeGreater(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return <>{isSizeGreater ? <p>Hi, {email}</p> : <SlSettings size={20} />}</>;
}

export default function Topbar() {
  const router = useRouter();
  const user = useGetUserFromCookie();
  const setSidebarCollapsed = useSetAtom(sidebarCollapseAtom);
  const handleCollpase = () => {
    setSidebarCollapsed((prev) => !prev);
  };
  const logoutMut = useLogout(router);
  return (
    <div className="flex flex-nowrap text-sm items-center justify-between px-4 py-3.5 bg-white shadow-[0_0_2rem_0_rgba(33,37,41,.1)]">
      <HiOutlineMenuAlt2
        size={32}
        onClick={handleCollpase}
        className="hover:text-blue-600"
      />
      <Dropdown
        label={<DropDownEmail email={user?.email} />}
        inline
        className="text-black"
      >
        {(user?.role === 'normal user 1' || user?.role === 'manager 1') && (
          <Dropdown.Item>
            <Link
              href={'/portal/transaction-limit'}
              as="/portal/transaction-limit"
              className="flex gap-2 items-center"
            >
              <VscSettings size={18} className="text-black font-bold" />
              Transaction Limits
            </Link>
          </Dropdown.Item>
        )}
        {(user?.role === 'normal user 2' || user?.role === 'manager 2') && (
          <Dropdown.Item className="flex gap-2 items-center">
            <SlSettings size={18} className="text-black font-bold" />
            System Maintenance
          </Dropdown.Item>
        )}
        <Dropdown.Item>
          <Link
            href={'/portal/change-password'}
            as={'/portal/change-password'}
            className="flex gap-2 items-center"
          >
            <HiOutlineLockClosed size={18} className="text-black font-bold" />
            Change Password
          </Link>
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item
          disabled={logoutMut.isLoading}
          onClick={() => {
            logoutMut.mutate(user?.id ?? '');
          }}
        >
          Log out
        </Dropdown.Item>
      </Dropdown>
    </div>
  );
}
