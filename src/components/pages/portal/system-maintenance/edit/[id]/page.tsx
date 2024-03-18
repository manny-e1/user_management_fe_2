'use client';
import BreadCrumbs from '@/components/BreadCrumbs';
import Section from '@/components/Section';
import { usePermission } from '@/hooks/usePermission';
import {
  SysMaintenance,
  SysMntInput,
  getMntLog,
  getMntLogs,
  updateMntLog,
  completeMntLogs,
} from '@/service/system-maintenance';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import moment from 'moment';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { usePwdValidityQuery } from '@/hooks/useCheckPwdValidityQuery';

export default function EditMaintenancePage() {
  const user = usePermission();
  const params = useParams();
  const router = useRouter();
  const [mntLog, setMntLog] = useState<SysMaintenance>();
  const [mntInput, setMntInput] = useState<SysMntInput>({
    fromDate: '',
    fromTime: '',
    toDate: '',
    toTime: '',
    minDate: '',
    minTime: '',
    iRakyat: false,
    iBizRakyat: false,
  });
  const [isStartDate, setIsStartDate] = useState<boolean>(false);
  const [isNotYetStartDate, setIsNotYetStartDate] = useState<boolean>(false);

  const id = params?.id;

  usePwdValidityQuery(user?.id);

  const mntLogsQry = useQuery({
    queryKey: ['system-maintenance'],
    queryFn: getMntLogs,
    refetchOnWindowFocus: false,
  });

  const getMntQry = useQuery({
    queryKey: ['getMnt', id],
    queryFn: () => getMntLog(id as string),
    enabled: id !== null,
    refetchOnWindowFocus: false,
  });
  const queryClient = useQueryClient();

  const requestMntMut = useMutation({
    mutationFn: updateMntLog,
    onSuccess: (data) => {
      if ('error' in data) {
        Swal.fire({
          title: 'Error!',
          text: data.error,
          icon: 'error',
        });
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['system-maintenance'] });
      Swal.fire({
        title: 'Success!',
        text: "You've successfully sent the request for approval.",
        icon: 'success',
      }).then(() => {
        router.push('/portal/system-maintenance');
      });
    },
  });

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

  useEffect(() => {
    if (getMntQry.data) {
      if ('mntLog' in getMntQry.data) {
        const data = getMntQry.data.mntLog;
        setMntLog(data);
        setMntInput({
          fromDate: moment(data.extendedStartDate || data.startDate).format(
            'YYYY-MM-DD'
          ),
          fromTime: moment(data.extendedStartDate || data.startDate).format(
            'HH:mm'
          ),
          toDate: moment(data.extendedEndDate || data.endDate).format(
            'YYYY-MM-DD'
          ),
          toTime: moment(data.extendedEndDate || data.endDate).format('HH:mm'),
          iRakyat: data.iRakyatYN,
          iBizRakyat: data.iBizRakyatYN,
          minDate: '',
          minTime: '',
        });

        const today = new Date().toISOString();
        const startDate = new Date(
          getMntQry.data.mntLog.startDate
        ).toISOString();
        if (startDate <= today) setIsStartDate(true);
        if (today <= startDate) setIsNotYetStartDate(true);
      }
    }
  }, [getMntQry.data]);

  // Handle events
  const handleSaveClick = () => {
    const tmpInput: SysMntInput = mntInput;

    tmpInput.minTime = '';
    if (tmpInput.fromDate != '') tmpInput.minDate = tmpInput.fromDate;
    if (tmpInput.fromDate == tmpInput.toDate) {
      if (tmpInput.fromTime != '') tmpInput.minTime = tmpInput.fromTime;
    }
    setMntInput(tmpInput);
  };

  const submitForm = async () => {
    let mntLogs: SysMaintenance[] = [];
    if (mntLogsQry.data && 'mntLogs' in mntLogsQry.data)
      mntLogs = mntLogsQry.data?.mntLogs ?? [];
    const startDate = new Date(
      mntInput.fromDate + ' ' + mntInput.fromTime
    ).toISOString();
    const endDate = new Date(
      mntInput.toDate + ' ' + mntInput.toTime
    ).toISOString();

    if (mntInput.iRakyat === false && mntInput.iBizRakyat === false) {
      await Swal.fire(
        'Error',
        'You must select at least one channel.',
        'error'
      );
      return;
    }

    for (let k = 0; k < mntLogs.length; ++k) {
      if (
        ((mntInput.iRakyat && mntLogs[k].iRakyatYN) ||
          (mntInput.iBizRakyat && mntLogs[k].iBizRakyatYN)) &&
        ((endDate > mntLogs[k].startDate && endDate < mntLogs[k].endDate) ||
          (startDate > mntLogs[k].startDate &&
            startDate < mntLogs[k].endDate) ||
          (startDate > mntLogs[k].startDate && endDate < mntLogs[k].endDate) ||
          (startDate < mntLogs[k].startDate && endDate > mntLogs[k].endDate))
      ) {
        await Swal.fire(
          'Error',
          'System maintenance schedule is overlapping.',
          'error'
        );
        return;
      }
    }

    requestMntMut.mutate({
      id: id,
      email: user?.email ?? '',
      mntInput: mntInput,
    });
  };

  // Handle Input Events
  const handleFromDateChange = (data: string) => {
    setMntInput({
      ...mntInput,
      fromDate: data,
    });
  };

  const handleFromTimeChange = (data: string) => {
    setMntInput({
      ...mntInput,
      fromTime: data,
    });
  };

  const handleEndDateChange = (data: string) => {
    setMntInput({
      ...mntInput,
      toDate: data,
    });
  };

  const handleEndTimeChange = (data: string) => {
    setMntInput({
      ...mntInput,
      toTime: data,
    });
  };

  const handleIRakyatChange = (checked: boolean) => {
    setMntInput({
      ...mntInput,
      iRakyat: checked,
    });
  };

  const handleIBizRakyatChange = (checked: boolean) => {
    setMntInput({
      ...mntInput,
      iBizRakyat: checked,
    });
  };

  const breadCrumbs = [{ name: 'MANAGEMENT' }, { name: 'System Maintenance' }];

  return (
    <div className="p-4">
      <BreadCrumbs breadCrumbs={breadCrumbs} />
      <Section outerTitle="OBW System Maintenance" innerTitle="">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitForm();
          }}
        >
          <div className="w-full flex gap-2 text-[#495057]">
            <div className="w-1/3">
              <div>
                <div className="w-[120px] inline-block">Submitted Date</div>
                <div className="font-bold inline-block">
                  :{' '}
                  {mntLog?.submittedAt
                    ? moment(new Date(mntLog?.submittedAt)).format(
                        'YYYY-MM-DD HH:mm:ss'
                      )
                    : ''}
                </div>
              </div>
              <div>
                <div className="w-[120px] inline-block">Submitted By</div>
                <div className="font-bold inline-block">
                  : {mntLog?.submittedBy}
                </div>
              </div>
            </div>
            <div className="w-1/3">
              <div>
                <div className="w-[200px] inline-block">
                  Approved/Rejected Date
                </div>
                <div className="font-bold inline-block">
                  :{' '}
                  {mntLog?.updatedAt && mntLog.approvedBy !== ''
                    ? moment(new Date(mntLog?.updatedAt)).format(
                        'YYYY-MM-DD HH:mm:ss'
                      )
                    : ''}
                </div>
              </div>
              <div>
                <div className="w-[200px] inline-block">
                  Approved/Rejected By
                </div>
                <div className="font-bold inline-block">
                  : {mntLog?.approvedBy}
                </div>
              </div>
            </div>
            <div className="w-1/3">
              <div>
                <div className="w-[120px] inline-block">Request Status</div>
                <div className="font-bold inline-block">
                  :&nbsp;
                  {mntLog?.approvalStatus === undefined ? (
                    ''
                  ) : mntLog?.approvalStatus === 'Pending' ? (
                    <span className="font-semibold">Pending</span>
                  ) : mntLog?.approvalStatus === 'Rejected' ? (
                    <span className="text-red-500 font-semibold">Rejected</span>
                  ) : (
                    <span className="text-[#3b7ddd] font-semibold">
                      Approved
                    </span>
                  )}
                </div>
              </div>
              <div>
                <div className="w-[120px] inline-block">Submission</div>
                <div className="font-bold inline-block">
                  : {mntLog?.submissionStatus}
                </div>
              </div>
            </div>
          </div>
          <table className="mt-3 text-[#495057] w-full">
            <tbody>
              <tr>
                <td className="font-bold pe-1">From Date</td>
                <td className="font-bold px-1">From Time</td>
                <td className="font-bold px-1">To Date</td>
                <td className="font-bold px-1">To Time</td>
                <td className="font-bold px-1" colSpan={2}></td>
                <td className="font-bold px-1 text-center">
                  Maintenance Status
                </td>
              </tr>
              <tr>
                <td className="pe-1">
                  <input
                    type="date"
                    className="form-control datetime-picker-size"
                    value={mntInput?.fromDate}
                    onChange={(e) => handleFromDateChange(e.target.value)}
                    required
                  />
                </td>
                <td className="px-1">
                  <input
                    type="time"
                    className="form-control datetime-picker-size"
                    value={mntInput?.fromTime}
                    onChange={(e) => handleFromTimeChange(e.target.value)}
                    required
                  />
                </td>
                <td className="px-1">
                  <input
                    type="date"
                    className="form-control datetime-picker-size"
                    value={mntInput?.toDate}
                    min={mntInput.fromDate}
                    onChange={(e) => handleEndDateChange(e.target.value)}
                    required
                  />
                </td>
                <td className="px-1">
                  <input
                    type="time"
                    className="form-control datetime-picker-size"
                    value={mntInput?.toTime}
                    min={mntInput.fromTime}
                    onChange={(e) => handleEndTimeChange(e.target.value)}
                    required
                  />
                </td>
                <td className="ps-3" style={{ paddingInlineEnd: '2.75rem' }}>
                  <input
                    type="checkbox"
                    checked={mntInput?.iRakyat}
                    onChange={(e) => handleIRakyatChange(e.target.checked)}
                    className="before:content[''] peer relative h-4 w-4 cursor-pointer appearance-none rounded-sm border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10 focus:ring-0"
                  />
                  &nbsp;iRakyat
                  {mntLog?.submissionStatus !== 'Delete' &&
                    mntLog?.iBizRakyatStatus !== 'C' &&
                    mntLog?.iRakyatStatus !== 'C' && (
                      <>
                        {user?.role === 'normal user 2' && (
                          <>
                            {mntLog?.iRakyatYN &&
                              mntLog?.iRakyatStatus == 'A' &&
                              (mntLog?.approvalStatus == 'Approved' ||
                                mntLog?.approvalStatus === 'Rejected' ||
                                (mntLog?.approvalStatus == 'Pending' &&
                                  mntLog?.submissionStatus == 'Marked')) && (
                                <div
                                  className="flex items-center select-none hover:text-[#1cbb8c] cursor-pointer"
                                  style={{
                                    float: 'right',
                                    marginTop: '0.2rem',
                                  }}
                                  onClick={handleCompleteRakyat}
                                >
                                  <FiCheckCircle className="me-1" />
                                </div>
                              )}
                          </>
                        )}
                      </>
                    )}
                </td>
                <td className="ps-3" style={{ paddingInlineEnd: '2.75rem' }}>
                  <input
                    type="checkbox"
                    checked={mntInput?.iBizRakyat}
                    onChange={(e) => handleIBizRakyatChange(e.target.checked)}
                    className="before:content[''] peer relative h-4 w-4 cursor-pointer appearance-none rounded-sm border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10 focus:ring-0"
                  />
                  &nbsp;iBizRakyat
                  {mntLog?.submissionStatus !== 'Delete' &&
                    mntLog?.iBizRakyatStatus !== 'C' &&
                    mntLog?.iRakyatStatus !== 'C' && (
                      <>
                        {user?.role === 'normal user 2' && (
                          <>
                            {mntLog?.iBizRakyatYN &&
                              mntLog?.iBizRakyatStatus == 'A' &&
                              (mntLog?.approvalStatus == 'Approved' ||
                                mntLog?.approvalStatus === 'Rejected' ||
                                (mntLog?.approvalStatus == 'Pending' &&
                                  mntLog?.submissionStatus == 'Marked')) && (
                                <div
                                  className="flex items-center select-none hover:text-[#1cbb8c] cursor-pointer"
                                  style={{
                                    float: 'right',
                                    marginTop: '0.2rem',
                                  }}
                                  onClick={handleCompleteBizRakyat}
                                >
                                  <FiCheckCircle className="me-1" />
                                </div>
                              )}
                          </>
                        )}
                      </>
                    )}
                </td>
                <td className="ps-2">
                  {mntLog?.iRakyatYN && mntLog?.iBizRakyatYN ? (
                    <div className="flex justify-center items-center">
                      {
                        <span
                          className={`${
                            (mntLog?.iRakyatStatus == 'C' && mntLog?.iBizRakyatStatus == 'C') && 
                            !((mntLog?.submissionStatus == 'New' || mntLog?.submissionStatus == 'Delete') && (mntLog?.approvalStatus == 'Pending' || mntLog?.approvalStatus == 'Rejected'))
                              ? 'bg-gray-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-gray-500 border border-gray-500'
                              : isStartDate &&
                                (mntLog?.iRakyatStatus == 'A' ||
                                  mntLog?.iBizRakyatStatus == 'A')
                              ? 'bg-green-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-500 border border-green-500'
                              : isNotYetStartDate &&
                                mntLog?.approvalStatus == 'Approved'
                              ? 'bg-yellow-400 text-white text-xs font-medium mr-1 px-2.5 py-0.5 rounded-full dark:bg-yellow-400 border border-yellow-400'
                              : ''
                          }`}
                        >
                          {(mntLog?.iRakyatStatus == 'C' && mntLog?.iBizRakyatStatus == 'C') && 
                          !((mntLog?.submissionStatus == 'New' || mntLog?.submissionStatus == 'Delete') && (mntLog?.approvalStatus == 'Pending' || mntLog?.approvalStatus == 'Rejected')) ? (
                            <>Completed</>
                          ) : isStartDate &&
                            (mntLog?.iRakyatStatus == 'A' ||
                              mntLog?.iBizRakyatStatus == 'A') ? (
                            <>Ongoing</>
                          ) : isNotYetStartDate &&
                            mntLog?.approvalStatus == 'Approved' ? (
                            <>Active</>
                          ) : (
                            <></>
                          )}
                        </span>
                      }
                    </div>
                  ) : mntLog?.iRakyatYN ? (
                    <div className="flex justify-center items-center">
                      {
                        <span
                          className={`${
                            mntLog?.iRakyatStatus == 'C' && !((mntLog?.submissionStatus == 'New' || mntLog?.submissionStatus == 'Delete') && (mntLog?.approvalStatus == 'Pending' || mntLog?.approvalStatus == 'Rejected'))
                              ? 'bg-gray-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-gray-500 border border-gray-500'
                              : isStartDate && mntLog?.iRakyatStatus == 'A'
                              ? 'bg-green-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-500 border border-green-500'
                              : isNotYetStartDate &&
                                mntLog?.approvalStatus == 'Approved'
                              ? 'bg-yellow-400 text-white text-xs font-medium mr-1 px-2.5 py-0.5 rounded-full dark:bg-yellow-400 border border-yellow-400'
                              : ''
                          }`}
                        >
                          {mntLog?.iRakyatStatus == 'C' && !((mntLog?.submissionStatus == 'New' || mntLog?.submissionStatus == 'Delete') && (mntLog?.approvalStatus == 'Pending' || mntLog?.approvalStatus == 'Rejected')) ? (
                            <>Completed</>
                          ) : isStartDate && mntLog?.iRakyatStatus == 'A' ? (
                            <>Ongoing</>
                          ) : isNotYetStartDate &&
                            mntLog?.approvalStatus == 'Approved' ? (
                            <>Active</>
                          ) : (
                            <></>
                          )}
                        </span>
                      }
                    </div>
                  ) : mntLog?.iBizRakyatYN ? (
                    <div className="flex justify-center items-center">
                      {
                        <span
                          className={`${
                            mntLog?.iBizRakyatStatus == 'C' &&
                            !((mntLog?.submissionStatus == 'New' || mntLog?.submissionStatus == 'Delete') && (mntLog?.approvalStatus == 'Pending' || mntLog?.approvalStatus == 'Rejected'))
                              ? 'bg-gray-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-gray-500 border border-gray-500'
                              : isStartDate && mntLog?.iBizRakyatStatus == 'A'
                              ? 'bg-green-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-500 border border-green-500'
                              : isNotYetStartDate &&
                                mntLog?.approvalStatus == 'Approved'
                              ? 'bg-yellow-400 text-white text-xs font-medium mr-1 px-2.5 py-0.5 rounded-full dark:bg-yellow-400 border border-yellow-400'
                              : ''
                          }`}
                        >
                          {mntLog?.iBizRakyatStatus == 'C' && 
                          !((mntLog?.submissionStatus == 'New' || mntLog?.submissionStatus == 'Delete') && (mntLog?.approvalStatus == 'Pending' || mntLog?.approvalStatus == 'Rejected')) ? (
                            <>Completed</>
                          ) : isStartDate && mntLog?.iBizRakyatStatus == 'A' ? (
                            <>Ongoing</>
                          ) : isNotYetStartDate &&
                            mntLog?.approvalStatus == 'Approved' ? (
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
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex justify-end gap-1 mt-4">
            {user?.role === 'normal user 2' && (
              <>
                <Link
                  href={'/portal/system-maintenance'}
                  aria-disabled={requestMntMut.isLoading}
                >
                  <button
                    type="button"
                    className={`bg-[#6c757d] hover:bg-[#5c636a] active:bg-[#565e64] text-white px-3 py-1 rounded-[4px] flex`}
                  >
                    Cancel
                  </button>
                </Link>
                <button
                  disabled={requestMntMut.isLoading}
                  type="submit"
                  className={`bg-[#3b7ddd] hover:bg-[#326abc] active:bg-[#2f64b1] text-white px-3 py-1 rounded-[4px] flex`}
                  onClick={handleSaveClick}
                >
                  Save
                </button>
              </>
            )}
          </div>
        </form>
      </Section>
    </div>
  );
}
