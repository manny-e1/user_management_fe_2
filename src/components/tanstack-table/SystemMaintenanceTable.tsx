'use client';
import Link from 'next/link';
import Table from './Table';
import {
  SysMaintenance,
  completeMntLogs,
  deleteMntLog,
} from '../../service/system-maintenance';
import { maintenanceListingColumns } from '@/lib/maintenance-listing-columns';
import { FiCheckCircle } from 'react-icons/fi';
import { usePermission } from '@/hooks/usePermission';
import Swal from 'sweetalert2';
import { API_URL } from '@/lib/config';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { SortingState } from '@tanstack/react-table';

const Actions = ({ mnt }: { mnt: SysMaintenance }) => {
  const { id } = mnt;
  const user = usePermission();
  let b2cChannelStatus = mnt.iRakyatStatus;
  let b2bChannelStatus = mnt.iBizRakyatStatus;

  const queryClient = useQueryClient();

  const completeMut = useMutation({
    mutationFn: completeMntLogs,
    onSuccess: async (data) => {
      if ('error' in data) {
        await Swal.fire({
          title: 'Error!',
          text: data.error,
          icon: 'error',
        });
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['system-maintenance'] });
      await Swal.fire({
        title: 'Success!',
        text: 'You’ve successfully sent the request for approval.',
        icon: 'success',
      });
    },
  });

  const deleteMut = useMutation({
    mutationFn: deleteMntLog,
    onSuccess: async (data) => {
      if ('error' in data) {
        await Swal.fire({
          title: 'Error!',
          text: data.error,
          icon: 'error',
        });
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['system-maintenance'] });
    },
  });

  const handleDeleteClick = async () => {
    await Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to delete?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        deleteMut.mutate({ id });
        Swal.fire({
          title: 'Success!',
          text: "You've successfully sent the request for approval",
          icon: 'success',
        });
      }
    });
  };

  const handleCompleteRakyat = async () => {
    await Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to mark as completed?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        completeMut.mutate({
          id: id,
          channel: 'rakyat',
        });
      }
    });
  };

  const handleCompleteBizRakyat = async () => {
    await Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to mark as completed?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        completeMut.mutate({
          id: id,
          channel: 'bizRakyat',
        });
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/portal/system-maintenance/view-detail/${id}`}
        className="text-blue-500"
      >
        View
      </Link>
      {mnt.submissionStatus !== 'Delete' &&
        (mnt.iBizRakyatStatus !== 'C' || mnt.iRakyatStatus !== 'C') && (
          <>
            {user?.role == 'normal user 2' &&
              (b2cChannelStatus.indexOf('C') == -1 && b2bChannelStatus.indexOf('C') == -1) && (
                <>
                  <Link
                    href={`/portal/system-maintenance/edit/${id}`}
                    className="text-blue-500"
                  >
                    Edit
                  </Link>
                </>
              )}

            {user?.role === 'normal user 2' && 
              (b2cChannelStatus.indexOf('C') == -1 && b2bChannelStatus.indexOf('C') == -1) &&
              ((mnt.iRakyatYN && mnt.iRakyatStatus != 'A') || (mnt.iBizRakyatYN && mnt.iBizRakyatStatus != 'A')) && 
              ((mnt.submissionStatus === 'New' || mnt.submissionStatus === 'Edited') && mnt.approvalStatus === 'Pending') && (
                <span
                  onClick={handleDeleteClick}
                  className="text-blue-500 cursor-pointer"
                >
                  Delete
                </span>
              )}
            {user?.role === 'normal user 2' && (
              <div className="flex flex-col gap-1">
                {mnt.iRakyatYN &&
                  mnt.iRakyatStatus == 'A' &&
                  !mnt.iRakyatCN &&
                  (mnt.approvalStatus == 'Approved' ||
                    mnt.approvalStatus === 'Rejected' ||
                    (mnt.approvalStatus == 'Pending' &&
                      mnt.submissionStatus == 'Marked')) && (
                    <div
                      className="flex items-center select-none hover:text-[#1cbb8c] cursor-pointer"
                      onClick={handleCompleteRakyat}
                    >
                      <FiCheckCircle className="inline-block me-1" />
                      i-Rakyat
                    </div>
                  )}
                {/* {mnt.iRakyatYN &&
                mnt.iRakyatStatus == 'C' &&
                mnt.approvalStatus == 'Pending' && (
                  <div className="flex items-center select-none text-[#1cbb8c]">
                    <FiCheckCircle className="inline-block me-1" />
                    i-Rakyat
                  </div>
                )} */}
                {mnt.iBizRakyatYN &&
                  mnt.iBizRakyatStatus == 'A' &&
                  !mnt.iBizRakyatCN &&
                  (mnt.approvalStatus == 'Approved' ||
                    mnt.approvalStatus === 'Rejected' ||
                    (mnt.approvalStatus == 'Pending' &&
                      mnt.submissionStatus == 'Marked')) && (
                    <div
                      className="flex items-center select-none hover:text-[#1cbb8c] cursor-pointer"
                      onClick={handleCompleteBizRakyat}
                    >
                      <FiCheckCircle className="inline-block me-1" />
                      i-BizRakyat
                    </div>
                  )}
                {/* {mnt.iBizRakyatYN &&
                mnt.iBizRakyatStatus == 'C' &&
                mnt.approvalStatus == 'Pending' && (
                  <div className="flex items-center select-none text-[#1cbb8c]">
                    <FiCheckCircle className="inline-block me-1" />
                    i-BizRakyat
                  </div>
                )} */}
              </div>
            )}
          </>
        )}
    </div>
  );
};

const CheckBox = ({ mnt }: { mnt: SysMaintenance }) => {
  let visibility = mnt.iBizRakyatStatus !== 'C' && mnt.iRakyatStatus !== 'C';

  if (
    (mnt.iBizRakyatStatus === 'C' || mnt.iRakyatStatus === 'C') &&
    mnt.approvalStatus === 'Pending'
  )
    visibility = true;

  return (
    <div className="p-1">
      {visibility && (
        <>
          {mnt.approvalStatus !== 'Rejected' &&
            mnt.approvalStatus !== 'Approved' && (
              <input
                type="checkbox"
                className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-sm border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10 focus:ring-0"
                id={mnt.id}
              />
            )}
        </>
      )}
    </div>
  );
};

const Channel = ({ mnt }: { mnt: SysMaintenance }) => {
  return (
    <div className="flex flex-col gap-1">
      {mnt.iRakyatYN ? (
        <div className="flex justify-between items-center">
          <span className="flex items-center">i-Rakyat</span>
        </div>
      ) : (
        <></>
      )}
      {mnt.iBizRakyatYN ? (
        <div className="flex justify-between items-center">
          <span className="flex items-center">i-BizRakyat</span>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

const Status = ({ mnt }: { mnt: SysMaintenance }) => {
  const today = new Date().toISOString();
  const startDate = new Date(mnt.startDate).toISOString();

  return (
    <div className="flex flex-col gap-1">
      {mnt.iRakyatYN && mnt.iBizRakyatYN ? (
        <div className="flex justify-center items-center">
          {
            <span
              className={`${
                mnt.iRakyatStatus == 'C' && mnt.iBizRakyatStatus == 'C'
                  ? 'bg-gray-500 text-white text-xs font-medium mr-1 px-2.5 py-0.5 rounded-full dark:bg-gray-500 border border-gray-500'
                  : startDate <= today &&
                    (mnt.iRakyatStatus === 'A' || mnt.iBizRakyatStatus === 'A')
                  ? 'bg-green-500 text-white text-xs font-medium mr-1 px-2.5 py-0.5 rounded-full dark:bg-green-500 border border-green-500'
                  : today <= startDate && mnt.approvalStatus == 'Approved'
                  ? 'bg-yellow-400 text-white text-xs font-medium mr-1 px-2.5 py-0.5 rounded-full dark:bg-yellow-400 border border-yellow-400'
                  : ''
              }`}
            >
              {mnt.iRakyatStatus == 'C' && mnt.iBizRakyatStatus === 'C' ? (
                <>Completed</>
              ) : startDate <= today &&
                (mnt.iRakyatStatus === 'A' || mnt.iBizRakyatStatus === 'A') ? (
                <>Ongoing</>
              ) : today <= startDate && mnt.approvalStatus == 'Approved' ? (
                <>Active</>
              ) : (
                <></>
              )}
            </span>
          }
        </div>
      ) : mnt.iRakyatYN ? (
        <div className="flex justify-center items-center">
          {
            <span
              className={`${
                mnt.iRakyatStatus == 'C'
                  ? 'bg-gray-500 text-white text-xs font-medium mr-1 px-2.5 py-0.5 rounded-full dark:bg-gray-500 border border-gray-500'
                  : startDate <= today && mnt.iRakyatStatus === 'A'
                  ? 'bg-green-500 text-white text-xs font-medium mr-1 px-2.5 py-0.5 rounded-full dark:bg-green-500 border border-green-500'
                  : today <= startDate && mnt.approvalStatus == 'Approved'
                  ? 'bg-yellow-400 text-white text-xs font-medium mr-1 px-2.5 py-0.5 rounded-full dark:bg-yellow-400 border border-yellow-400'
                  : ''
              }`}
            >
              {mnt.iRakyatStatus == 'C' ? (
                <>Completed</>
              ) : startDate <= today && mnt.iRakyatStatus === 'A' ? (
                <>Ongoing</>
              ) : today <= startDate && mnt.approvalStatus == 'Approved' ? (
                <>Active</>
              ) : (
                <></>
              )}
            </span>
          }
        </div>
      ) : mnt.iBizRakyatYN ? (
        <div className="flex justify-center items-center">
          {
            <span
              className={`${
                mnt.iBizRakyatStatus == 'C'
                  ? 'bg-gray-500 text-white text-xs font-medium mr-1 px-2.5 py-0.5 rounded-full dark:bg-gray-500 border border-gray-500'
                  : startDate <= today && mnt.iBizRakyatStatus === 'A'
                  ? 'bg-green-500 text-white text-xs font-medium mr-1 px-2.5 py-0.5 rounded-full dark:bg-green-500 border border-green-500'
                  : today <= startDate && mnt.approvalStatus == 'Approved'
                  ? 'bg-yellow-400 text-white text-xs font-medium mr-1 px-2.5 py-0.5 rounded-full dark:bg-yellow-400 border border-yellow-400'
                  : ''
              }`}
            >
              {mnt.iBizRakyatStatus == 'C' ? (
                <>Completed</>
              ) : startDate <= today && mnt.iBizRakyatStatus === 'A' ? (
                <>Ongoing</>
              ) : today <= startDate && mnt.approvalStatus == 'Approved' ? (
                <>Active</>
              ) : (
                <></>
              )}
            </span>
          }
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

const checkboxes = (mnt: SysMaintenance) => <CheckBox mnt={mnt} />;
const channel = (mnt: SysMaintenance) => <Channel mnt={mnt} />;
const status = (mnt: SysMaintenance) => <Status mnt={mnt} />;
const actions = (mnt: SysMaintenance) => <Actions mnt={mnt} />;

export default function SystemMaintenanceTable({
  data,
  hide,
  onClick,
}: {
  data: SysMaintenance[];
  hide: boolean;
  onClick: (sorting?: SortingState) => void;
}) {
  return (
    <Table
      data={data}
      hide={hide}
      onClick={onClick}
      columns={maintenanceListingColumns(checkboxes, channel, status, actions)}
      route="/portal/system-maintenance/request"
    />
  );
}
