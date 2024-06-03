'use client';
import BreadCrumbs from '@/components/BreadCrumbs';
import Section from '@/components/Section';
import MFAConfigTable from '@/components/tanstack-table/MFAConfigTable';
import { usePwdValidityQuery } from '@/hooks/useCheckPwdValidityQuery';
import { usePermission } from '@/hooks/usePermission';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { capitalizeFirstLetter } from '@/helper';
import * as XLSX from 'xlsx';
import moment from 'moment';
import { SortingState } from '@tanstack/react-table';
import { MFAConfig, getMFAConfigs } from '@/service/mfa-config';

export default function MFAConfigurationPage() {
  const user = usePermission();
  const router = useRouter();
  usePwdValidityQuery(user?.id);
  const mfaConfigQry = useQuery({
    queryKey: ['mfa-configs'],
    queryFn: getMFAConfigs,
    refetchOnWindowFocus: false,
  });

  if (mfaConfigQry.data && 'error' in mfaConfigQry.data) {
    return <p>{mfaConfigQry.data.error}</p>;
  }

  const handleExport = (sorting?: SortingState) => {
    const rows: any[] = [];
    const sortField = sorting?.length ? sorting[0].id : '';
    const sortDesc =
      (sorting?.length ? sorting[0].desc : false) == false ? 1 : -1;
    const topColumnNames: any[] = [
      undefined,
      undefined,
      'Current Value',
      undefined,
      null,
      'New Value',
      undefined,
      undefined,
      undefined,
    ];
    const bottomColumnNames: any[] = [
      'No.#',
      'Submit Date & Time',
      'cMA',
      'cMO',
      'cSMS',
      'nMA',
      'nMO',
      'nSMS',
      'Status',
    ];

    let data: MFAConfig[] = [];
    if (mfaConfigQry.data && 'mfaConfigs' in mfaConfigQry.data) {
      data = mfaConfigQry.data.mfaConfigs.sort((a: MFAConfig, b: MFAConfig) => {
        if (sortField === 'cSMS') return (a.cSMS - b.cSMS) * sortDesc;
        else if (sortField === 'cMO') return (a.cMO - b.cMO) * sortDesc;
        else if (sortField === 'cMA') return (a.cMA - b.cMA) * sortDesc;
        else if (sortField === 'nSMS') return (a.nSMS - b.nSMS) * sortDesc;
        else if (sortField === 'nMO') return (a.nMO - b.nMO) * sortDesc;
        else if (sortField === 'nMA') return (a.nMA - b.nMA) * sortDesc;
        else if (sortField === 'createdAt')
          return Number(a.createdAt > b.createdAt) * sortDesc;
        else if (sortField === 'status') {
          return a.status.localeCompare(b.status) * sortDesc;
        } else return 1;
      });
    }

    data.forEach((row) => {
      const rowData: any = [];
      rowData.push(row.tid);
      rowData.push(moment(row.createdAt).format('YYYY-MM-DD hh:mm A'));
      rowData.push(row.cMA);
      rowData.push(row.cMO);
      rowData.push(row.cSMS);
      rowData.push(row.nMA);
      rowData.push(row.nMO);
      rowData.push(row.nSMS);
      rowData.push(capitalizeFirstLetter(row.status));
      rows.push(rowData);
    });

    const newData = [topColumnNames, bottomColumnNames, ...rows];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(newData, {
      skipHeader: true,
    });
    XLSX.utils.book_append_sheet(wb, ws, 'MySheet');
    XLSX.writeFile(wb, 'mfa configuration.xlsx');
  };

  const mfaConfigs =
    mfaConfigQry.data?.mfaConfigs.map((item: MFAConfig) => {
      return {
        ...item,
        createdAt: moment(item.createdAt).format('YYYY-MM-DD hh:mm A'),
      };
    }) ?? [];

  const breadCrumbs = [{ name: 'MANAGEMENT' }, { name: 'MFA Configuration' }];
  return (
    <div className="p-4 text-[#495057] no-scrollbar">
      <BreadCrumbs breadCrumbs={breadCrumbs} />
      <Section
        outerTitle="OBW MFA Configuration"
        innerTitle="MFA Configuration"
      >
        <MFAConfigTable
          data={!mfaConfigs || mfaConfigQry.isFetching ? [] : mfaConfigs}
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
                  <td className="pl-1">MA</td>
                  <td>: i-Secure Mobile Authorization</td>
                </tr>
                <tr>
                  <td className="pl-1">MO</td>
                  <td>: i-Secure Mobile OTP</td>
                </tr>
                <tr>
                  <td className="pl-1">SMS</td>
                  <td>: SMS OTP (One Time Password)</td>
                </tr>
              </tbody>
            </table>
          </fieldset>
        </div>
      </Section>
    </div>
  );
}
