import Table from '@/components/tanstack-table/Table';
import { rejectionListingColumns } from '@/lib/rejection-listing-columns';
import { getRejectLogs } from '@/service/rejection-logs';
import { Dialog, Transition } from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import { Fragment, useState } from 'react';

export default function RejectionModal({
  id,
  visible,
  setVisible,
}: {
  id: string;
  visible: boolean;
  setVisible: (vis: boolean) => void;
}) {
  const closeModal = () => setVisible(false);

  const getRejectLogQry = useQuery({
    queryKey: ['rejection-log'],
    queryFn: () => getRejectLogs(id),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  return (
    <>
      <Transition appear show={visible} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-[60%] justify-center p-4 pt-20 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Rejection Log
                  </Dialog.Title>

                  <Table
                    route=""
                    data={
                      getRejectLogQry.isFetched
                        ? getRejectLogQry.data &&
                          'error' in getRejectLogQry.data
                          ? []
                          : getRejectLogQry.data?.rjtLogs ?? []
                        : []
                    }
                    hideUtility={true}
                    columns={rejectionListingColumns()}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
