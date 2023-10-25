'use client';
import { usePermission } from '@/hooks/usePermission';
import { getPendingCounts } from '@/service/common';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { FiSettings, FiSliders, FiUsers } from 'react-icons/fi';

export default function DashboardPage() {
  const router = useRouter();
  const user = usePermission();
  const type =
    user?.role === 'admin'
      ? 'users'
      : user?.role === 'manager 1'
      ? 'transaction'
      : 'maintenance';
  const pendQry = useQuery({
    queryKey: ['pending-count'],
    queryFn: async () => getPendingCounts(type),
    enabled: user?.role !== undefined,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  });

  if (pendQry.data && 'error' in pendQry.data) {
    return <p>{pendQry.data.error}</p>;
  }

  const count = pendQry.data?.count ?? 0;

  const handleToTransaction = () => {
    localStorage.setItem('filter', 'set');
    router.push('/portal/transaction-limit');
  };

  const handleToMaintenance = () => {
    localStorage.setItem('filter', 'set');
    router.push('/portal/system-maintenance');
  };

  const handleToUserManagement = () => {
    localStorage.setItem('filter', 'set');
    router.push('/portal/users');
  };

  return (
    <div className="p-4 flex flex-col gap-2">
      <h2 className="font-bold text-3xl">Dashboard</h2>
      <p className="text-xl mb-2">
        Welcome to OBW Management and Maintenance Portal
      </p>

      <div className="flex flex-wrap -mx-3">
        {user?.role === 'manager 1' && (
          <div className="flex w-full md:w-1/2 order-1 min-[1440px]:w-1/4 px-3 mb-4">
            <div
              className="flex flex-col relative items-center justify-center bg-white w-full p-4"
              onClick={handleToTransaction}
            >
              <div className="flex absolute z-10 w-full h-full justify-center group cursor-pointer">
                <FiSliders className="w-[120px] rounded-md h-[120px] text-[#17a2b8] mt-4 border border-[#17a2b8] group-hover:bg-[#17a2b8] group-hover:text-white transition-all duration-500 p-2" />
              </div>
              <div className="flex text-md mt-[140px] justify-center">
                {count} Pending Tasks
              </div>
              <div className="flex relative font-bold text-xl justify-center text-[#6c757d] border border-[#6c757d] rounded-md w-full">
                Transaction Limits
                <div
                  className={`${
                    count === 0 ? 'hidden' : 'block'
                  } absolute text-sm right-0 px-2 py-1 bg-red-600 text-white rounded-md translate-x-1/2 -translate-y-1/2`}
                >
                  {count}
                </div>
              </div>
            </div>
          </div>
        )}

        {user?.role === 'manager 2' && (
          <>
            {/* System Maintenance */}
            <div className="flex w-full md:w-1/2 order-2 min-[1440px]:w-1/4 px-3 mb-4">
              <div className="flex flex-col relative items-center justify-center bg-white w-full p-4">
                <div
                  className="flex absolute z-10 w-full h-full justify-center group cursor-pointer"
                  onClick={handleToMaintenance}
                >
                  <FiSettings className="w-[120px] rounded-md h-[120px] text-[#17a2b8] mt-4 border border-[#17a2b8] group-hover:bg-[#17a2b8] group-hover:text-white transition-all duration-500 p-2" />
                </div>
                <div className="flex text-md mt-[140px] justify-center">
                  {count} Pending Tasks
                </div>
                <div className="flex relative font-bold text-xl justify-center text-[#6c757d] border border-[#6c757d] rounded-md w-full">
                  System Maintenance
                  <div
                    className={`${
                      count === 0 ? 'hidden' : 'block'
                    } absolute text-sm right-0 px-2 py-1 bg-red-600 text-white rounded-md translate-x-1/2 -translate-y-1/2`}
                  >
                    {count}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {user?.role === 'admin' && (
          <>
            {/* System Maintenance */}
            <div className="flex w-full md:w-1/2 order-2 min-[1440px]:w-1/4 px-3 mb-4">
              <div className="flex flex-col relative items-center justify-center bg-white w-full p-4">
                <div
                  className="flex absolute z-10 w-full h-full justify-center group cursor-pointer"
                  onClick={handleToUserManagement}
                >
                  <FiUsers className="w-[120px] rounded-md h-[120px] text-[#17a2b8] mt-4 border border-[#17a2b8] group-hover:bg-[#17a2b8] group-hover:text-white transition-all duration-500 p-2" />
                </div>
                <div className="flex text-md mt-[140px] justify-center">
                  {count} Locked Users
                </div>
                <div className="flex relative font-bold text-xl justify-center text-[#6c757d] border border-[#6c757d] rounded-md w-full">
                  User Management
                  <div
                    className={`${
                      count === 0 ? 'hidden' : 'block'
                    } absolute text-sm right-0 px-2 py-1 bg-red-600 text-white rounded-md translate-x-1/2 -translate-y-1/2`}
                  >
                    {count}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
