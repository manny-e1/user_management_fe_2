'use client';
import { sidebarCollapseAtom } from '@/atoms';
import { useGetUserFromCookie } from '@/hooks/useGetUseFromCookie';
import { useAtom } from 'jotai';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BsChevronUp, BsChevronDown } from 'react-icons/bs';
import { GoPeople } from 'react-icons/go';
import { HiOutlineLockClosed } from 'react-icons/hi';
import { FiSettings } from 'react-icons/fi'
import { VscSettings } from 'react-icons/vsc';

export default function Sidebar() {
  const user = useGetUserFromCookie();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useAtom(sidebarCollapseAtom);
  const [dropdownCollapsed, setDropdownCollapsed] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (pathname?.includes('/users') || pathname?.includes('/user-groups')) {
      setDropdownCollapsed(false);
    }
  }, [pathname]);

  return (
    <aside
      className={`  text-[#ced4da] !bg-[#013750] md:text-sm text-xs h-screen `}
      style={{
        transition: 'min-width 500ms cubic-bezier(0.2, 0, 0, 1) 0s',
        minWidth: sidebarCollapsed ? '0' : '260px',
        maxWidth: '0',
      }}
    >
      <ul className={sidebarCollapsed ? 'overflow-hidden -z-10' : ''}>
        <li className="relative max-w-full h-20  py-5 px-5 mb-4">
          <Image
            src="/BR Logo Black Tagline.png"
            alt="BR Logo Black Tagline"
            fill
          />
        </li>
        {
          (user?.role !== 'normal user 1' && user?.role !== 'normal user 2') && 
          <li className={`py-2.5 mb-5 text-[rgba(233,236,239,.5)] px-5 hover-active-bg ${
            pathname?.includes('/dashboard') &&
            'active-bg border-l-[3px] border-[#3b7ddd] -ml-1'
          }`}>
            <Link
              href="/portal/dashboard"
              as="/portal/dashboard"
              className="flex flex-1 items-center gap-3"
            >
              <VscSettings size={20} />
              Dashboard
            </Link>
          </li>
        }
        <li className="px-5 text-[#ced4da] mb-2">Management</li>
        {(user?.role === 'manager 1' || user?.role === 'normal user 1') && (
          <li
            className={`py-2.5 text-[rgba(233,236,239,.5)] px-5 hover-active-bg ${
              pathname?.includes('/transaction-limit') &&
              'active-bg border-l-[3px] border-[#3b7ddd] -ml-1'
            }`}
          >
            <Link
              href="/portal/transaction-limit"
              as="/portal/transaction-limit"
              className="flex flex-1 items-center gap-3"
            >
              <VscSettings size={20} />
              Transaction Limit
            </Link>
          </li>
        )}
        {(user?.role === 'manager 2' || user?.role === 'normal user 2') && (
          <li
            className={`py-2.5 text-[rgba(233,236,239,.5)] px-5 hover-active-bg ${
              pathname?.includes('/system-maintenance') &&
              'active-bg border-l-[3px] border-[#3b7ddd] -ml-1'
            }`}
          >
            <Link
              href="/portal/system-maintenance"
              as="/portal/system-maintenance"
              className="flex flex-1 items-center gap-3"
            >
              <FiSettings size={20} />
              System Maintenance
            </Link>
          </li>
        )}
        {(user?.role === 'admin' || user?.role === 'admin 2') && (
          <>
            <li
              className={`flex items-center hover-active-bg text-[rgba(233,236,239,.5)] justify-between w-full py-2.5 px-5 ${
                (pathname?.includes('/users') ||
                  pathname?.includes('/user-groups')) &&
                'active-bg border-l-[3px] border-[#3b7ddd] -ml-1'
              } ${dropdownCollapsed && 'mb-2'}`}
            >
              <button
                onClick={() => setDropdownCollapsed(!dropdownCollapsed)}
                className="flex items-center justify-between w-full"
              >
                <span className="flex items-center gap-3">
                  <GoPeople size={18} /> <p> Admin Maintenace</p>
                </span>
                {dropdownCollapsed ? <BsChevronDown /> : <BsChevronUp />}
              </button>
            </li>
            <ul
              className={`${dropdownCollapsed ? ' hidden ' : ' block mb-2'} `}
              style={{
                transition: 'visibility 500ms cubic-bezier(0.2, 0, 0, 1) 0s',
              }}
            >
              {user?.role !== 'admin 2' && (
                <li
                  className={`py-2.5 ml-[1.25rem] text-[rgba(233,236,239,.5)] pl-[1.85rem] hover-active-bg ${
                    pathname?.includes('/users') &&
                    'active-bg border-l-[3px] border-[#3b7ddd] ml-5'
                  }`}
                >
                  <Link
                    href="/portal/users"
                    as="/portal/users"
                    className="flex flex-1"
                  >
                    User Management
                  </Link>
                </li>
              )}

              <li
                className={`py-2.5 ml-[1.25rem] text-[rgba(233,236,239,.5)] pl-[1.85rem] hover-active-bg ${
                  pathname?.includes('/user-groups') &&
                  'active-bg border-l-[3px] border-[#3b7ddd] ml-5'
                }`}
              >
                <Link
                  href="/portal/user-groups"
                  as="/portal/user-groups"
                  className="flex flex-1"
                >
                  Group and Role
                </Link>
              </li>
            </ul>
          </>
        )}
        <li
          className={`py-2.5 px-5 text-[rgba(233,236,239,.5)] hover-active-bg ${
            pathname?.includes('/change-password') &&
            'active-bg border-l-[3px] border-[#3b7ddd]'
          }`}
        >
          <Link
            href="/portal/change-password"
            as="/portal/change-password"
            className="flex flex-1 items-center gap-3 -ml-1"
          >
            <HiOutlineLockClosed size={20} />
            Change Password
          </Link>
        </li>
      </ul>
    </aside>
  );
}
