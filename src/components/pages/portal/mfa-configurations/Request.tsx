'use client';
import BreadCrumbs from '@/components/BreadCrumbs';
import Modal from '@/components/Modal';
import Section from '@/components/Section';
import { formatCurrency, removeComma, validateNumberInput } from '@/helper';
import { usePermission } from '@/hooks/usePermission';
import {
  requestMFAConfig,
  getMFAConfigLastUpdatedValue,
} from '@/service/mfa-config';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function RequestMFAConfigPage() {
  const user = usePermission();

  const router = useRouter();
  const [cSMS, setCSMS] = useState<string | null>(null);
  const [cMO, setCMO] = useState<string | null>(null);
  const [cMA, setCMA] = useState<string | null>(null);
  const [nSMS, setNSMS] = useState('');
  const [nMO, setNMO] = useState('');
  const [nMA, setNMA] = useState('');
  const [err, setErr] = useState<{ error: string | null; showModal: boolean }>({
    error: null,
    showModal: false,
  });
  const queryClient = useQueryClient();
  const requestMFAConfigMut = useMutation({
    mutationFn: requestMFAConfig,
    onSuccess: (data) => {
      if ('error' in data) {
        Swal.fire({
          title: 'Error!',
          text: data.error,
          icon: 'error',
        });
        return;
      }
      queryClient.invalidateQueries(['mfa-configurations']);
      Swal.fire({
        title: 'Success!',
        text: "You've successfully sent the request for approval.",
        icon: 'success',
      }).then(() => {
        router.push('/portal/mfa-configurations');
      });
    },
  });

  const lastUpdatedValueQry = useQuery({
    queryKey: ['last-updated'],
    queryFn: getMFAConfigLastUpdatedValue,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (lastUpdatedValueQry.data) {
      if (!('error' in lastUpdatedValueQry.data)) {
        const txnLog = lastUpdatedValueQry.data.mfaConfig;
        setCSMS(txnLog.nSMS.toString());
        setCMO(txnLog.nMO.toString());
        setCMA(txnLog.nMA.toString());
        setNSMS(txnLog.nSMS.toString());
        setNMO(txnLog.nMO.toString());
        setNMA(txnLog.nMA.toString());
      } else {
        setNSMS('3');
        setNMO('3');
        setNMA('3');
      }
    } else {
      setNSMS('3');
      setNMO('3');
      setNMA('3');
    }
  }, [lastUpdatedValueQry.data]);

  const handleSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    if (!Number(nSMS) || !Number(nMO) || !Number(nMA)) {
      Swal.fire({
        title: 'Error!',
        text: 'The amount must be a number.',
        icon: 'error',
      });
      return;
    }
    requestMFAConfigMut.mutate({
      nSMS: +nSMS,
      nMO: +nMO,
      nMA: +nMA,
      cMA: cMA ? +cMA : 3,
      cMO: cMO ? +cMO : 3,
      cSMS: cSMS ? +cSMS : 3,
    });
  };

  const breadCrumbs = [{ name: 'MANAGEMENT' }, { name: 'MFA Configuration' }];
  return (
    <div className="p-4">
      <BreadCrumbs breadCrumbs={breadCrumbs} />
      <Section
        outerTitle="OBW MFA Configuration"
        innerTitle="New Request - MFA Configuration"
      >
        {/* {requestTxnMut.isSuccess && <p>{JSON.stringify(requestTxnMut.data)}</p>} */}
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
                i-Secure Mobile Authorization
              </label>
              <div className=" px-[calc(var(--bs-gutter-x)*.5)]  w-full">
                <input
                  type="text"
                  id="rib"
                  className="form-control"
                  required
                  onBlur={() => setNMO(nMO)}
                  value={nMO}
                  onChange={(e) => setNMO(validateNumberInput(e.target.value))}
                />
              </div>
            </div>
            <div className="flex flex-wrap w-full space-y-1">
              <label
                htmlFor="rmb"
                className="py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)]  w-full"
              >
                i-Secure Mobile OTP
              </label>
              <div className=" px-[calc(var(--bs-gutter-x)*.5)]  w-full">
                <input
                  type="text"
                  id="rmb"
                  className="form-control"
                  required
                  onBlur={() => setNMA(nMA)}
                  value={nMA}
                  onChange={(e) => setNMA(validateNumberInput(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="w-full flex gap-1 max-md:flex-wrap">
            <div className="flex flex-wrap w-1/2 space-y-1">
              <label
                htmlFor="cib"
                className="py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)]  w-full"
              >
                SMS OTP (One-Time Password)
              </label>
              <div className="px-[calc(var(--bs-gutter-x)*.5)]  w-full">
                <input
                  type="text"
                  id="cib"
                  className="form-control"
                  required
                  onBlur={() => setNSMS(nSMS)}
                  value={nSMS}
                  onChange={(e) => setNSMS(validateNumberInput(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="w-full flex justify-end gap-2">
            <Link
              href="/portal/mfa-configurations"
              className=" mt-3 text-white disabled:cursor-not-allowed disabled:opacity-50 bg-[#6c757d] hover:bg-[#5c636a] rounded-[0.2rem] px-[0.85rem] py-[0.35rem] focus:shadow-[0_0_0_0.2rem_rgba(130,138,145,.5)]"
            >
              {' '}
              Cancel{' '}
            </Link>
            <button
              type="submit"
              id="btnSaveNewPassword"
              className="disabled:cursor-not-allowed disabled:opacity-50 mt-3 text-white bg-[#3b7ddd] hover:bg-[#326abc] rounded-[0.2rem] px-[0.85rem] py-[0.35rem] focus:shadow-[0_0_0_0.2rem_rgba(88,145,226,.5)]"
            >
              {' '}
              Save{' '}
            </button>
          </div>
        </form>
        {err.showModal && (
          <Modal
            error={!!err.error}
            message={
              !!err.error
                ? err.error
                : 'Your mfa configuration request is submitted'
            }
            onClick={() => {
              setErr({ error: null, showModal: false });
              if (err.error) {
                return;
              }
              router.push('/portal/mfa-configurations');
            }}
          />
        )}
      </Section>
    </div>
  );
}
