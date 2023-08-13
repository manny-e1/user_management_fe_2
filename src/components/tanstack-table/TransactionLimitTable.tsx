'use client';
import { transactionListingColums } from '@/lib/transactin-limit-listing-colums';
import Table from './Table';
import { TxnLimit } from '@/service/transaction-limit';
import Link from 'next/link';
import { formatCurrency } from '@/helper';

function Actions({ id }: { id: string }) {
  return (
    <Link
      href={`/portal/transaction-limit/view-detail/${id}`}
      className="text-blue-500"
    >
      View
    </Link>
  );
}

function actions(id: string) {
  return <Actions id={id} />;
}

function newData(txn: TxnLimit, field: string) {
  return <div>
    {
      field == "rib" &&
      <span className={`${txn.cRIB === txn.nRIB ? "" : "font-bold text-blue-500 italic"}`}>
        {formatCurrency(txn.nRIB)}
      </span>
    }
    {
      field == "rmb" &&
      <span className={`${txn.cRMB === txn.nRMB ? "" : "font-bold text-blue-500 italic"}`}>
        {formatCurrency(txn.nRMB)}
      </span>
    }
    {
      field == "cib" &&
      <span className={`${txn.cCIB === txn.nCIB ? "" : "font-bold text-blue-500 italic"}`}>
        {formatCurrency(txn.nCIB)}
      </span>
    }
    {
      field == "cmb" &&
      <span className={`${txn.cCMB === txn.nCMB ? "" : "font-bold text-blue-500 italic"}`}>
        {formatCurrency(txn.nCMB)}
      </span>
    }
  </div>
}

export default function TransactionTable({
  data,
  hide,
  onClick,
}: {
  data: TxnLimit[];
  hide: boolean;
  onClick: () => void;
}) {
  return (
    <Table
      data={data}
      columns={transactionListingColums(actions, newData)}
      route="/portal/transaction-limit/request"
      hide={hide}
      onClick={onClick}
    />
  );
}
