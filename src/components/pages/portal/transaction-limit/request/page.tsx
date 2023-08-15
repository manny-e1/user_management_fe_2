'use client';
import BreadCrumbs from '@/components/BreadCrumbs';
import Modal from '@/components/Modal';
import Section from '@/components/Section';
import { formatCurrency, removeComma, validateNumberInput } from '@/helper';
import { usePermission } from '@/hooks/usePermission';
import { createTxnLog, getLastUpdatedValue } from '@/service/transaction-limit';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function RequestTransactionPage() {
  const user = usePermission();

  const router = useRouter();
  const [cCmb, setCCMB] = useState<string | null>(null);
  const [cCib, setCCIB] = useState<string | null>(null);
  const [cRmb, setCRMB] = useState<string | null>(null);
  const [cRib, setCRIB] = useState<string | null>(null);
  const [nCmb, setNCMB] = useState('');
  const [nCib, setNCIB] = useState('');
  const [nRmb, setNRMB] = useState('');
  const [nRib, setNRIB] = useState('');
  const [err, setErr] = useState<{ error: string | null; showModal: boolean }>({
    error: null,
    showModal: false,
  });
  const queryClient = useQueryClient();
  const requestTxnMut = useMutation({
    mutationFn: createTxnLog,
    onSuccess: (data) => {
      if ('error' in data) {
        Swal.fire({
          title: 'Error!',
          text: data.error,
          icon: 'error',
        });
        return;
      }
      queryClient.invalidateQueries(['transaction-limit']);
      Swal.fire({
        title: 'Success!',
        text: "You've successfully sent the request for approval.",
        icon: 'success',
      }).then(() => {
        router.push('/portal/transaction-limit');
      });
    },
  });

  const lastValuesQry = useQuery({
    queryKey: ['lastvalues'],
    queryFn: getLastUpdatedValue,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (lastValuesQry.data) {
      if ('txnLog' in lastValuesQry.data) {
        const txnLog = lastValuesQry.data.txnLog;
        setCRIB(txnLog.nRIB.toString());
        setCRMB(txnLog.nRMB.toString());
        setCCIB(txnLog.nCIB.toString());
        setCCMB(txnLog.nCMB.toString());
        setNRIB(formatCurrency(txnLog.nRIB));
        setNRMB(formatCurrency(txnLog.nRMB));
        setNCIB(formatCurrency(txnLog.nCIB));
        setNCMB(formatCurrency(txnLog.nCMB));
      } else {
        setNRIB('50,000.00');
        setNRMB('50,000.00');
        setNCIB('10,000,000.00');
        setNCMB('10,000,000.00');
      }
    } else {
      setNRIB('50,000.00');
      setNRMB('50,000.00');
      setNCIB('10,000,000.00');
      setNCMB('10,000,000.00');
    }
  }, [lastValuesQry.data]);

  const handleSubmit = (evt: FormEvent) => {
    if (
      !Number(removeComma(nCib)) ||
      !Number(removeComma(nCmb)) ||
      !Number(removeComma(nRib)) ||
      !Number(removeComma(nRmb))
    ) {
      Swal.fire({
        title: 'Error!',
        text: 'The limit value cannot be empty or 0.00',
        icon: 'error',
      });
      return;
    }

    evt.preventDefault();
    requestTxnMut.mutate({
      cRIB: cRib ? Number(removeComma(cRib)) : 50000,
      cRMB: cRmb ? Number(removeComma(cRmb)) : 50000,
      cCIB: cCib ? Number(removeComma(cCib)) : 100000,
      cCMB: cCmb ? Number(removeComma(cCmb)) : 100000,
      nCIB: Number(removeComma(nCib)),
      nCMB: Number(removeComma(nCmb)),
      nRIB: Number(removeComma(nRib)),
      nRMB: Number(removeComma(nRmb)),
      marker: user?.email ?? '',
    });
  };

  const breadCrumbs = [{ name: 'MANAGEMENT' }, { name: 'Transation Limit' }];
  return (
    <div className="p-4">
      <BreadCrumbs breadCrumbs={breadCrumbs} />
      <Section
        outerTitle="OBW Transaction Limit Maintenance"
        innerTitle="New Request - Transaction Limit"
      >
        {requestTxnMut.isSuccess && <p>{JSON.stringify(requestTxnMut.data)}</p>}
        <form
          id="frmRequestTxn"
          onSubmit={handleSubmit}
          className="flex flex-wrap text-sm mx-[calc(var(--bs-gutter-x)*-.5)] mt-[calc(var(--bs-gutter-y)*-1)] needs-validation space-y-2"
        >
          <div className="w-full flex gap-1 max-md:flex-wrap">
            <div className="flex flex-wrap w-full space-y-1">
              <label
                htmlFor="rib"
                className="py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)]  w-full"
              >
                Retail Internet Banking Limit (Per Day)
              </label>
              <div className=" px-[calc(var(--bs-gutter-x)*.5)]  w-full">
                <input
                  type="text"
                  id="rib"
                  className="form-control"
                  required
                  onBlur={() =>
                    setNRIB(formatCurrency(parseInt(removeComma(nRib))))
                  }
                  value={nRib}
                  onChange={(e) => setNRIB(validateNumberInput(e.target.value))}
                />
              </div>
            </div>
            <div className="flex flex-wrap w-full space-y-1">
              <label
                htmlFor="rmb"
                className="py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)]  w-full"
              >
                Retail Mobile Banking Limit (Per Day)
              </label>
              <div className=" px-[calc(var(--bs-gutter-x)*.5)]  w-full">
                <input
                  type="text"
                  id="rmb"
                  className="form-control"
                  required
                  onBlur={() =>
                    setNRMB(formatCurrency(parseInt(removeComma(nRmb))))
                  }
                  value={nRmb}
                  onChange={(e) => setNRMB(validateNumberInput(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="w-full flex gap-1 max-md:flex-wrap">
            <div className="flex flex-wrap w-full space-y-1">
              <label
                htmlFor="cib"
                className="py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)]  w-full"
              >
                Corporate Internet Banking Limit (Per Transaction)
              </label>
              <div className="px-[calc(var(--bs-gutter-x)*.5)]  w-full">
                <input
                  type="text"
                  id="cib"
                  className="form-control"
                  required
                  onBlur={() =>
                    setNCIB(formatCurrency(parseInt(removeComma(nCib))))
                  }
                  value={nCib}
                  onChange={(e) => setNCIB(validateNumberInput(e.target.value))}
                />
              </div>
            </div>
            <div className="flex flex-wrap w-full space-y-1">
              <label
                htmlFor="cmb"
                className="py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)]  w-full"
              >
                Corporate Mobile Banking Limit (Per Transaction)
              </label>
              <div className=" px-[calc(var(--bs-gutter-x)*.5)]  w-full">
                <input
                  type="text"
                  id="cmb"
                  datatype="currency"
                  className="form-control"
                  required
                  onBlur={() =>
                    setNCMB(formatCurrency(parseInt(removeComma(nCmb))))
                  }
                  value={nCmb}
                  onChange={(e) => setNCMB(validateNumberInput(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="w-full flex justify-end gap-2">
            <Link
              href="/portal/transaction-limit"
              className=" mt-3 text-white disabled:cursor-not-allowed disabled:opacity-50 bg-[#6c757d] hover:bg-[#5c636a] rounded-[0.2rem] px-[0.85rem] py-[0.35rem] focus:shadow-[0_0_0_0.2rem_rgba(130,138,145,.5)]"
            >
              {' '}
              Cancel{' '}
            </Link>
            <button
              type="submit"
              disabled={
                !Number(removeComma(nCib)) ||
                !Number(removeComma(nCmb)) ||
                !Number(removeComma(nRib)) ||
                !Number(removeComma(nRmb)) ||
                requestTxnMut.isLoading
              }
              id="btnSaveNewPassword"
              className="disabled:cursor-not-allowed disabled:opacity-50 mt-3 text-white bg-[#3b7ddd] hover:bg-[#326abc] rounded-[0.2rem] px-[0.85rem] py-[0.35rem] focus:shadow-[0_0_0_0.2rem_rgba(88,145,226,.5)]"
            >
              {' '}
              Submit{' '}
            </button>
          </div>
        </form>
        {err.showModal && (
          <Modal
            error={!!err.error}
            message={
              !!err.error
                ? err.error
                : 'Your transaction limit request is submitted'
            }
            onClick={() => {
              setErr({ error: null, showModal: false });
              if (err.error) {
                return;
              }
              router.push('/portal/transaction-limit');
            }}
          />
        )}
      </Section>
    </div>
  );
}
