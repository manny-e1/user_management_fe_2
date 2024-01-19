'use client';
import BreadCrumbs from '@/components/BreadCrumbs';
import Section from '@/components/Section';
import { formatCurrency, formatDate } from '@/helper';
import { usePermission } from '@/hooks/usePermission';
import { changeTxnStatus, getTxnById } from '@/service/transaction-limit';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function ViewTransactionPage() {
  const user = usePermission();
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [cCmb, setCCMB] = useState('');
  const [cCib, setCCIB] = useState('');
  const [cRmb, setCRMB] = useState('');
  const [cRib, setCRIB] = useState('');
  const [nCmb, setNCMB] = useState('');
  const [nCib, setNCIB] = useState('');
  const [nRmb, setNRMB] = useState('');
  const [nRib, setNRIB] = useState('');
  const [updateChecker, setUpdateChecker] = useState<string>();
  const [subDate, setSubDate] = useState<Date>();
  const [updDate, setUpdDate] = useState<Date>();
  const [status, setStatus] = useState<number>();
  const [msg, setMsg] = useState('');
  const [marker, setMarker] = useState('');

  const gettxnQry = useQuery({
    queryKey: ['gettxn', id],
    queryFn: async () => getTxnById(id as string),
    enabled: id !== null,
    refetchOnWindowFocus: false,
  });
  const queryClient = useQueryClient();
  useEffect(() => {
    if (gettxnQry.data) {
      if ('txnLog' in gettxnQry.data) {
        const txnLog = gettxnQry.data.txnLog;
        setCRIB(txnLog.cRIB.toString());
        setCRMB(txnLog.cRMB.toString());
        setCCIB(txnLog.cCIB.toString());
        setCCMB(txnLog.cCMB.toString());
        setNRIB(txnLog.nRIB.toString());
        setNRMB(txnLog.nRMB.toString());
        setNCIB(txnLog.nCIB.toString());
        setNCMB(txnLog.nCMB.toString());
        setSubDate(new Date(txnLog.createdAt));
        setUpdDate(
          !(txnLog.createdAt === txnLog.updatedAt)
            ? new Date(txnLog.updatedAt)
            : undefined
        );
        setStatus(txnLog.status);
        setMsg(txnLog.msg);
        setMarker(txnLog.marker);
        setUpdateChecker(txnLog.updateChecker ?? undefined);
      }
    }
  }, [gettxnQry.data]);

  const approve = useMutation({
    mutationFn: changeTxnStatus,
    onSuccess: (data) => {
      if ('error' in data) {
        Swal.fire('Error', data.error, 'error');
        return;
      }
      queryClient.invalidateQueries(['transaction-limit']);
      Swal.fire(
        'Approved!',
        'You’ve successfully approved the transaction limit request.',
        'success'
      ).then(() => {
        router.push('/portal/transaction-limit');
      });
    },
  });
  const reject = useMutation({
    mutationFn: changeTxnStatus,
    onSuccess: (data) => {
      if ('error' in data) {
        Swal.fire('Error', data.error, 'error');
        return;
      }
      queryClient.invalidateQueries(['transaction-limit']);
      Swal.fire(
        'Rejected!',
        'You’ve successfully rejected the transaction limit request.',
        'success'
      ).then(() => {
        router.push('/portal/transaction-limit');
      });
    },
  });

  const handleApprove = () => {
    approve.mutate({
      id: id ?? '',
      checker: user?.email ?? '',
      status: 1,
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
          console.log({ value: result.value });

          reject.mutate({
            id: id ?? '',
            checker: user?.email ?? '',
            status: -1,
            msg: result.value,
          });
        } else {
          Swal.fire('Error', 'You must input the reason.', 'error')
            .then(() => handleApprove())
            .catch((error) => console.log(error));
        }
      }
    });
  };

  const breadCrumbs = [{ name: 'MANAGEMENT' }, { name: 'Transation Limit' }];
  return (
    <div className="p-4 overflow-y-scroll">
      <BreadCrumbs breadCrumbs={breadCrumbs} />
      <Section outerTitle="OBW Transaction Limit Maintenance" innerTitle="">
        <span className="flex justify-end mt-[-2rem] mb-8 text-sm">
          Status:
          {status === undefined ? (
            ''
          ) : status === 0 ? (
            <p className="font-semibold">Pending</p>
          ) : status === -1 ? (
            <p className="text-red-500 font-semibold">Rejected</p>
          ) : (
            <p className="text-[#3b7ddd] font-semibold">Approved</p>
          )}
        </span>
        <div className="flex flex-wrap text-sm mx-[calc(var(--bs-gutter-x)*-.5)] mt-[calc(var(--bs-gutter-y)*-1)] needs-validation space-y-10">
          <div className="w-full">
            <h5 className="text-[#939ba2] text-[.925rem] font-semibold px-[calc(var(--bs-gutter-x)*.5)">
              Current Value
            </h5>
            <div className="w-full flex gap-1 max-md:flex-wrap">
              <div className="flex flex-wrap w-full space-y-1">
                <label
                  htmlFor="crib"
                  className="py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)]  w-full"
                >
                  Retail Internet Banking Limit (Per Day)
                </label>
                <div className=" px-[calc(var(--bs-gutter-x)*.5)]  w-full">
                  <input
                    type="text"
                    readOnly
                    id="crib"
                    className="form-control"
                    value={formatCurrency(Number(cRib))}
                  />
                </div>
              </div>
              <div className="flex flex-wrap w-full space-y-1">
                <label
                  htmlFor="crmb"
                  className="py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)]  w-full"
                >
                  Retail Mobile Banking Limit (Per Day)
                </label>
                <div className=" px-[calc(var(--bs-gutter-x)*.5)]  w-full">
                  <input
                    type="text"
                    readOnly
                    id="crmb"
                    className="form-control"
                    value={formatCurrency(Number(cRmb))}
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex gap-1 max-md:flex-wrap">
              <div className="flex flex-wrap w-full space-y-1">
                <label
                  htmlFor="ccib"
                  className="py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)]  w-full"
                >
                  Corporate Internet Banking Limit (Per Transaction)
                </label>
                <div className="px-[calc(var(--bs-gutter-x)*.5)]  w-full">
                  <input
                    type="text"
                    readOnly
                    id="ccib"
                    className="form-control"
                    required
                    value={formatCurrency(Number(cCib))}
                  />
                </div>
              </div>
              <div className="flex flex-wrap w-full space-y-1">
                <label
                  htmlFor="ccmb"
                  className="py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)]  w-full"
                >
                  Corporate Mobile Banking Limit (Per Transaction)
                </label>
                <div className=" px-[calc(var(--bs-gutter-x)*.5)]  w-full">
                  <input
                    type="text"
                    readOnly
                    id="ccmb"
                    datatype="currency"
                    className="form-control"
                    value={formatCurrency(Number(cCmb))}
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
                  htmlFor="nrib"
                  className="py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)]  w-full"
                >
                  Retail Internet Banking Limit (Per Day)
                </label>
                <div className=" px-[calc(var(--bs-gutter-x)*.5)]  w-full">
                  <input
                    type="text"
                    readOnly
                    id="nrib"
                    className="form-control"
                    required
                    value={formatCurrency(Number(nRib))}
                  />
                </div>
              </div>
              <div className="flex flex-wrap w-full space-y-1">
                <label
                  htmlFor="nrmb"
                  className="py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)]  w-full"
                >
                  Retail Mobile Banking Limit (Per Day)
                </label>
                <div className=" px-[calc(var(--bs-gutter-x)*.5)]  w-full">
                  <input
                    type="text"
                    readOnly
                    id="nrmb"
                    className="form-control"
                    value={formatCurrency(Number(nRmb))}
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex gap-1 max-md:flex-wrap">
              <div className="flex flex-wrap w-full space-y-1">
                <label
                  htmlFor="ncib"
                  className="py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)]  w-full"
                >
                  Corporate Internet Banking Limit (Per Transaction)
                </label>
                <div className="px-[calc(var(--bs-gutter-x)*.5)]  w-full">
                  <input
                    type="text"
                    readOnly
                    id="ncib"
                    className="form-control"
                    value={formatCurrency(Number(nCib))}
                  />
                </div>
              </div>
              <div className="flex flex-wrap w-full space-y-1">
                <label
                  htmlFor="ncmb"
                  className="py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)]  w-full"
                >
                  Corporate Mobile Banking Limit (Per Transaction)
                </label>
                <div className=" px-[calc(var(--bs-gutter-x)*.5)]  w-full">
                  <input
                    type="text"
                    readOnly
                    id="ncmb"
                    datatype="currency"
                    className="form-control"
                    value={formatCurrency(Number(nCmb))}
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
                    value={marker}
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
                    value={formatDate(subDate)}
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
                    value={updateChecker}
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
                    value={formatDate(updDate)}
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
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-end gap-2">
            <Link
              href="/portal/transaction-limit"
              className="text-white bg-[#3b7ddd] hover:bg-[#326abc] rounded-[0.2rem] px-[0.85rem] py-[0.35rem] focus:shadow-[0_0_0_0.2rem_rgba(88,145,226,.5)]"
              aria-disabled={approve.isLoading || reject.isLoading}
            >
              Back
            </Link>
            {user?.role === 'manager 1' && status == 0 ? (
              <>
                <button
                  disabled={approve.isLoading || reject.isLoading}
                  type="submit"
                  id="btnApproved"
                  className="text-white bg-green-500 hover:bg-green-600 rounded-[0.2rem] px-[0.85rem] py-[0.35rem] focus:shadow-[0_0_0_0.2rem_rgba(88,145,226,.5)]"
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
      </Section>
    </div>
  );
}
