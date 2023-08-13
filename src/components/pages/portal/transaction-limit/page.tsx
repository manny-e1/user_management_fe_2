'use client';
import BreadCrumbs from '@/components/BreadCrumbs';
// import Modal from '@/components/Modal';
import Section from '@/components/Section';
import TransactionTable from '@/components/tanstack-table/TransactionLimitTable';
import { usePwdValidityQuery } from '@/hooks/useCheckPwdValidityQuery';
import { usePermission } from '@/hooks/usePermission';
import { TxnLimit, getTxnLogs } from '@/service/transaction-limit';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import moment from 'moment'

export default function TransactionLimitPage() {
  const user = usePermission();
  const router = useRouter();
  usePwdValidityQuery(user?.id);
  const txnLogsQry = useQuery({
    queryKey: ['transaction-limit'],
    queryFn: getTxnLogs,
    refetchOnWindowFocus: false,
  });

  const [xlData, setXlData] = useState<any[]>([]);

  useEffect(() => {
    const data = document.querySelector('table')?.querySelectorAll('tr') ?? [];
    const rows: any[] = [];
    const ths = document.querySelector('table')?.querySelectorAll('th');
    const topColumnNames: any[] = [];
    const bottomColumnNames: any[] = [];
    ths?.forEach((th) => {
      if (
        ['Current Trx Limit (RM)', 'New Trx Limit (RM)'].includes(
          th.textContent ?? ''
        )
      ) {
        topColumnNames.push(th.textContent);
      } else {
        bottomColumnNames.push(th.textContent);
      }
    });

    let btmColNames = bottomColumnNames.filter((col) => col !== '');
    btmColNames = btmColNames.slice(0, btmColNames.length - 1);
    const mm = topColumnNames[1];
    topColumnNames.unshift('');
    topColumnNames.unshift('');
    topColumnNames[3] = undefined;
    topColumnNames[4] = undefined;
    topColumnNames[5] = undefined;
    topColumnNames[6] = mm;
    topColumnNames[7] = undefined;
    topColumnNames.push('');
    data.forEach((row) => {
      const cells = row.querySelectorAll('td');
      const rowData: any = [];
      cells.forEach((cell) => {
        rowData.push(cell.textContent);
      });
      rows.push(rowData);
    });
    let newRows = rows.filter((row) => row.length > 0);
    newRows = newRows.map((row) => row.slice(0, row.length - 1));
    const newData = [topColumnNames, btmColNames, ...newRows];
    setXlData(newData);
  }, [txnLogsQry.data]);

  const handleExport = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(xlData, {
      skipHeader: true,
    });
    XLSX.utils.book_append_sheet(wb, ws, 'MySheet');
    XLSX.writeFile(wb, 'transaction limit.xlsx');
  };

  if (txnLogsQry.data && 'error' in txnLogsQry.data) {
    return <p>{txnLogsQry.data.error}</p>;
  }
  
  const txnLogs = txnLogsQry.data?.txnLogs.map((item: TxnLimit, index: number) => {
    return {
      ...item,
      createdAt: moment(item.createdAt).format("YYYY-MM-DD hh:mm A")
    }
  }) ?? [];

  const breadCrumbs = [{ name: 'MANAGEMENT' }, { name: 'Transation Limit' }];
  return (
    <div className="p-4 text-[#495057] no-scrollbar">
      <BreadCrumbs breadCrumbs={breadCrumbs} />
      <Section
        outerTitle="OBW Transaction Limit Maintenance"
        innerTitle="Transaction Limit"
      >
        <TransactionTable
          data={!txnLogs || txnLogsQry.isFetching ? [] : txnLogs}
          hide={user?.role === 'manager 1'}
          onClick={handleExport}
        />
        <hr className="my-3" />
        <div className="mt-5 text-sm leading-[2.0]">
          <fieldset className="rounded xs:w-full border p-1 sm:w-2/4 md:w-1/4">
            <legend className="text-sm-start fs-4 float-none w-auto px-3 hover:cursor-pointer">
              Legend:
            </legend>
            <table>
              <tbody>
                <tr>
                  <td className="pl-1">RIB</td>
                  <td>: Retail Internet Banking</td>
                </tr>
                <tr>
                  <td className="pl-1">RMB</td>
                  <td>: Retail Mobile Banking</td>
                </tr>
                <tr>
                  <td className="pl-1">CIB</td>
                  <td>: Corporate Internet Banking</td>
                </tr>
                <tr>
                  <td className="pl-1">CMB</td>
                  <td>: Corporate Mobile Banking</td>
                </tr>
                <tr>
                  <td className="pl-1">Trx</td>
                  <td>: Transaction</td>
                </tr>
              </tbody>
            </table>
          </fieldset>
        </div>
      </Section>
    </div>
  );
}
