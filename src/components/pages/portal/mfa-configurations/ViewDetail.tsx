'use client';
import BreadCrumbs from '@/components/BreadCrumbs';
import Section from '@/components/Section';
import { capitalizeFirstLetter, formatDate } from '@/helper';
import { usePermission } from '@/hooks/usePermission';
import { reviewMFAConfig, getMFAConfigById } from '@/service/mfa-config';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function ViewMFAConfigPage() {
  const user = usePermission();
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const getMFAConfigQry = useQuery({
    queryKey: ['get-mfa-config', id],
    queryFn: async () => getMFAConfigById(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
  const queryClient = useQueryClient();

  const approve = useMutation({
    mutationFn: reviewMFAConfig,
    onSuccess: (data) => {
      if ('error' in data) {
        Swal.fire('Error', data.error, 'error');
        return;
      }
      queryClient.invalidateQueries(['mfa-configurations']);
      Swal.fire(
        'Approved!',
        'You’ve successfully approved the MFA configuration request.',
        'success'
      ).then(() => {
        router.push('/portal/mfa-configurations');
      });
    },
  });
  const reject = useMutation({
    mutationFn: reviewMFAConfig,
    onSuccess: (data) => {
      if ('error' in data) {
        Swal.fire('Error', data.error, 'error');
        return;
      }
      queryClient.invalidateQueries(['mfa-configurations']);
      Swal.fire(
        'Rejected!',
        'You’ve successfully rejected the MFA configuration request.',
        'success'
      ).then(() => {
        router.push('/portal/mfa-configurations');
      });
    },
  });

  const handleApprove = () => {
    approve.mutate({
      id: id,
      body: {
        status: 'approved',
      },
    });
  };

  const handleReject = () => {
    Swal.fire({
      title: 'Reject',
      inputLabel: 'Leave a comment:',
      input: 'textarea',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value) {
          reject.mutate({
            id: id,
            body: {
              status: 'rejected',
              reason: result.value,
            },
          });
        } else {
          Swal.fire('Error', 'You must input the reason.', 'error').catch(
            (error) => console.log(error)
          );
        }
      }
    });
  };

  const breadCrumbs = [{ name: 'MANAGEMENT' }, { name: 'Transaction Limit' }];
  if (getMFAConfigQry.data && 'error' in getMFAConfigQry.data) {
    return <div>{getMFAConfigQry.data.error}</div>;
  }
  const mfaConfig = getMFAConfigQry.data?.mfaConfig;
  const status = mfaConfig?.status;
  const statusTextColor =
    status === 'approved'
      ? 'text-[#3b7ddd]'
      : status === 'rejected'
      ? 'text-red-500'
      : '';

  return (
    <div className="p-4 overflow-y-scroll">
      <BreadCrumbs breadCrumbs={breadCrumbs} />
      <Section outerTitle="OBW Transaction Limit Maintenance" innerTitle="">
        {getMFAConfigQry.isLoading ? (
          <div className="flex justify-center items-center">loading...</div>
        ) : (
          <>
            <span className="flex justify-end mt-[-2rem] mb-8 text-sm">
              Status:
              {status && (
                <p className={`${statusTextColor} font-semibold`}>
                  {capitalizeFirstLetter(status)}
                </p>
              )}
            </span>
            <div className="flex flex-wrap text-sm mx-[calc(var(--bs-gutter-x)*-.5)] mt-[calc(var(--bs-gutter-y)*-1)] needs-validation space-y-10">
              <div className="w-full">
                <h5 className="text-[#939ba2] text-[.925rem] font-semibold px-[calc(var(--bs-gutter-x)*.5) ml-2">
                  Current Value
                </h5>
                <div className="w-full flex gap-1 max-md:flex-wrap">
                  <div className="flex flex-wrap w-full space-y-1">
                    <label
                      htmlFor="cmo"
                      className="py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)]  w-full"
                    >
                      i-Secure Mobile Authorization
                    </label>
                    <div className="px-[calc(var(--bs-gutter-x)*.5)]  w-full">
                      <input
                        type="text"
                        readOnly
                        id="cmo"
                        className="form-control"
                        value={mfaConfig?.cMO}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap w-full space-y-1">
                    <label
                      htmlFor="cma"
                      className="py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)]  w-full"
                    >
                      i-Secure Mobile OTP
                    </label>
                    <div className=" px-[calc(var(--bs-gutter-x)*.5)]  w-full">
                      <input
                        type="text"
                        readOnly
                        id="cma"
                        className="form-control"
                        value={mfaConfig?.cMA}
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full flex gap-1 max-md:flex-wrap">
                  <div className="flex flex-wrap w-1/2 space-y-1">
                    <label
                      htmlFor="csms"
                      className="py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)]  w-full"
                    >
                      SMS OTP (One-Time Password)
                    </label>
                    <div className="px-[calc(var(--bs-gutter-x)*.5)]  w-full">
                      <input
                        type="text"
                        readOnly
                        id="csms"
                        className="form-control"
                        required
                        value={mfaConfig?.cSMS}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full">
                <h5 className="text-[#939ba2] text-[.925rem] font-semibold px-[calc(var(--bs-gutter-x)*.5)">
                  New Value
                </h5>

                <div className="w-full flex gap-1 max-md:flex-wrap">
                  <div className="flex flex-wrap w-full space-y-1">
                    <label
                      htmlFor="nmo"
                      className="py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)]  w-full"
                    >
                      i-Secure Mobile Authorization
                    </label>
                    <div className=" px-[calc(var(--bs-gutter-x)*.5)]  w-full">
                      <input
                        type="text"
                        readOnly
                        id="nmo"
                        className="form-control"
                        required
                        value={mfaConfig?.nMO}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap w-full space-y-1">
                    <label
                      htmlFor="nma"
                      className="py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)]  w-full"
                    >
                      i-Secure Mobile OTP
                    </label>
                    <div className=" px-[calc(var(--bs-gutter-x)*.5)]  w-full">
                      <input
                        type="text"
                        readOnly
                        id="nma"
                        className="form-control"
                        value={mfaConfig?.nMA}
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full flex gap-1 max-md:flex-wrap">
                  <div className="flex flex-wrap w-1/2 space-y-1">
                    <label
                      htmlFor="nsms"
                      className="py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)]  w-full"
                    >
                      SMS OTP (One-Time Password)
                    </label>
                    <div className="px-[calc(var(--bs-gutter-x)*.5)]  w-full">
                      <input
                        type="text"
                        readOnly
                        id="nsms"
                        className="form-control"
                        value={mfaConfig?.nSMS}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full flex gap-1 max-md:flex-wrap">
                  <div className="flex flex-wrap w-full space-y-1">
                    <label
                      htmlFor="submittedby"
                      className="py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)]  w-full"
                    >
                      Submitted By
                    </label>
                    <div className=" px-[calc(var(--bs-gutter-x)*.5)]  w-full">
                      <input
                        type="text"
                        readOnly
                        id="submittedby"
                        value={mfaConfig?.makerEmail}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap w-full space-y-1">
                    <label
                      htmlFor="submitteddate"
                      className="py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)]  w-full"
                    >
                      Submitted Date & Time
                    </label>
                    <div className=" px-[calc(var(--bs-gutter-x)*.5)]  w-full">
                      <input
                        type="text"
                        readOnly
                        id="submitteddate"
                        className="form-control"
                        value={formatDate(
                          mfaConfig?.createdAt
                            ? new Date(mfaConfig?.createdAt)
                            : undefined
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full flex gap-1 max-md:flex-wrap">
                  <div className="flex flex-wrap w-full space-y-1">
                    <label
                      htmlFor="appby"
                      className="py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)]  w-full"
                    >
                      Approved/Rejected By
                    </label>
                    <div className="px-[calc(var(--bs-gutter-x)*.5)]  w-full">
                      <input
                        type="text"
                        id="appby"
                        className="form-control"
                        value={
                          mfaConfig?.checkerEmail
                            ? mfaConfig.checkerEmail
                            : undefined
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap w-full space-y-1">
                    <label
                      htmlFor="upddate"
                      className="py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)]  w-full"
                    >
                      Approved/Rejected Date & Time
                    </label>
                    <div className=" px-[calc(var(--bs-gutter-x)*.5)]  w-full">
                      <input
                        type="text"
                        readOnly
                        id="upddate"
                        className="form-control"
                        value={formatDate(
                          mfaConfig?.actionTakenTime
                            ? new Date(mfaConfig?.actionTakenTime)
                            : undefined
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-1/2 flex gap-1 max-md:flex-wrap">
                  <div className="flex flex-wrap w-full space-y-1">
                    <label
                      htmlFor="rejreason"
                      className="py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)]  w-full"
                    >
                      Rejected Reason
                    </label>
                    <div className="px-[calc(var(--bs-gutter-x)*.5)]  w-full">
                      <textarea
                        id="rejreason"
                        className="form-control"
                        readOnly
                        value={
                          mfaConfig?.reason ? mfaConfig?.reason : undefined
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full flex justify-end gap-2">
                <Link
                  href="/portal/mfa-configurations"
                  className="text-white bg-[#3b7ddd] hover:bg-[#326abc] rounded-[0.2rem] px-[0.85rem] py-[0.35rem] focus:shadow-[0_0_0_0.2rem_rgba(88,145,226,.5)]"
                  aria-disabled={approve.isLoading || reject.isLoading}
                >
                  Back
                </Link>
                {user?.role === 'manager 1' && status === 'pending' ? (
                  <>
                    <button
                      disabled={approve.isLoading || reject.isLoading}
                      type="submit"
                      id="btnApproved"
                      className="text-white bg-[#3b7ddd] hover:bg-[#326abc] rounded-[0.2rem] px-[0.85rem] py-[0.35rem] focus:shadow-[0_0_0_0.2rem_rgba(88,145,226,.5)]"
                      onClick={handleApprove}
                    >
                      Approve
                    </button>
                    <button
                      disabled={approve.isLoading || reject.isLoading}
                      type="button"
                      id="btnRejected"
                      className="text-white bg-red-500 hover:bg-red-600 rounded-[0.2rem] px-[0.85rem] py-[0.35rem] focus:shadow-[0_0_0_0.2rem_rgba(88,145,226,.5)]"
                      onClick={handleReject}
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </>
        )}
      </Section>
    </div>
  );
}
