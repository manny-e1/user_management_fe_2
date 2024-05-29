'use client';
import { transactionListingColums } from '@/lib/transactin-limit-listing-colums';
import Table from './Table';
import { TxnLimit } from '@/service/transaction-limit';
import Link from 'next/link';
import { formatCurrency } from '@/helper';
import { MFAConfig } from '@/service/mfa-config';
import { mfaConfigListingColums } from '@/lib/mfa-config-listing-columns';

function Actions({ id }: { id: string }) {
  return (
    <Link
      href={`/portal/mfa-configurations/view-detail/${id}`}
      className="text-blue-500"
    >
      View
    </Link>
  );
}

function actions(id: string) {
  return <Actions id={id} />;
}

function newData(mfaConfig: MFAConfig, field: string) {
  return (
    <div>
      {field == 'sms' && (
        <span
          className={`${
            mfaConfig.cSMS === mfaConfig.nSMS
              ? ''
              : 'font-bold text-blue-500 italic'
          }`}
        >
          {mfaConfig.nSMS}
        </span>
      )}
      {field == 'mo' && (
        <span
          className={`${
            mfaConfig.cMO === mfaConfig.nMO
              ? ''
              : 'font-bold text-blue-500 italic'
          }`}
        >
          {mfaConfig.nMO}
        </span>
      )}
      {field == 'ma' && (
        <span
          className={`${
            mfaConfig.cMA === mfaConfig.nMA
              ? ''
              : 'font-bold text-blue-500 italic'
          }`}
        >
          {mfaConfig.nMA}
        </span>
      )}
    </div>
  );
}

export default function MFAConfigTable({
  data,
  hide,
  onClick,
}: {
  data: MFAConfig[];
  hide: boolean;
  onClick: () => void;
}) {
  return (
    <Table
      data={data}
      columns={mfaConfigListingColums(actions, newData)}
      route="/portal/mfa-configurations/request"
      hide={hide}
      onClick={onClick}
    />
  );
}
