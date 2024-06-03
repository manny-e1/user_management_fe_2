'use client';
import BreadCrumbs from '@/components/BreadCrumbs';
import Section from '@/components/Section';
import { usePwdValidityQuery } from '@/hooks/useCheckPwdValidityQuery';
import { usePermission } from '@/hooks/usePermission';
import { useQuery } from '@tanstack/react-query';
import * as XLSX from 'xlsx';
import moment from 'moment';
import { SortingState } from '@tanstack/react-table';
import { AuditLog, getAuditLogs } from '@/service/audit-log';
import AuditLogTable from '@/components/tanstack-table/AuditLogTable';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { AuditLogFilter, Filter } from '@/components/AuditLogFilter';
import { useUsersQuery } from '@/hooks/useUsersQuery';
import { User } from '@/service/user';

export default function AuditLogPage() {
  const user = usePermission();
  usePwdValidityQuery(user?.id);

  const [filter, setFilter] = useState<Filter>({
    modules: [],
    performers: [],
    fromDate: '',
    toDate: '',
    status: 'All',
  });
  const [emails, setEmails] = useState<string[]>([]);

  const auditLogsQry = useQuery({
    queryKey: [
      'audit-logs',
      filter.fromDate,
      filter.toDate,
      filter.modules.length,
      filter.performers.length,
      filter.status,
    ],
    queryFn: () => getAuditLogs(filter, emails.length),
    enabled:
      !!filter.fromDate ||
      !!filter.toDate ||
      !!filter.modules.length ||
      !!filter.performers.length,
    refetchOnWindowFocus: false,
  });
  console.log(filter);

  const usersQry = useUsersQuery();

  useEffect(() => {
    if (usersQry.data && !('error' in usersQry.data)) {
      const users = usersQry.data.users;
      const emailList = users.map((user: User) => user.email);
      setEmails(emailList);
    }
  }, [usersQry.isLoading]);

  if (auditLogsQry.data && 'error' in auditLogsQry.data) {
    return <p>{JSON.stringify(auditLogsQry.data.error)}</p>;
  }

  // const handleExport = (sorting?: SortingState) => {
  //   const rows: any[] = [];
  //   const sortField = sorting?.length ? sorting[0].id : '';
  //   const sortDesc =
  //     (sorting?.length ? sorting[0].desc : false) == false ? 1 : -1;
  //   const topColumnNames: any[] = [
  //     undefined,
  //     undefined,
  //     undefined,
  //     undefined,
  //     undefined,
  //     undefined,
  //   ];
  //   const bottomColumnNames: any[] = [
  //     'No.#',
  //     'Submit Date & Time',
  //     'cDisplayStatus',
  //     'nDisplayStatus',
  //     'imageUpdated',
  //     'Status',
  //   ];

  //   let data: ISecureNote[] = [];
  //   if (auditLogsQry.data && 'iSecureNotes' in auditLogsQry.data) {
  //     data = auditLogsQry.data.iSecureNotes.sort(
  //       (a: ISecureNote, b: ISecureNote) => {
  //         if (sortField === 'cDisplayStatus')
  //           return a.cDisplayStatus.localeCompare(b.cDisplayStatus) * sortDesc;
  //         else if (sortField === 'nDisplayStatus')
  //           return a.nDisplayStatus.localeCompare(b.nDisplayStatus) * sortDesc;
  //         else if (sortField === 'imageUpdated')
  //           return a.imageUpdated.localeCompare(b.imageUpdated) * sortDesc;
  //         else if (sortField === 'createdAt')
  //           return Number(a.createdAt > b.createdAt) * sortDesc;
  //         else if (sortField === 'status') {
  //           return a.status.localeCompare(b.status) * sortDesc;
  //         } else return 1;
  //       }
  //     );
  //   }

  //   data.forEach((row) => {
  //     const rowData: any = [];
  //     rowData.push(row.tid);
  //     rowData.push(moment(row.createdAt).format('YYYY-MM-DD hh:mm A'));
  //     rowData.push(capitalizeFirstLetter(row.cDisplayStatus));
  //     rowData.push(capitalizeFirstLetter(row.nDisplayStatus));
  //     rowData.push(row.imageUpdated === 'Y' ? 'Yes' : 'No');
  //     rowData.push(capitalizeFirstLetter(row.status));
  //     rows.push(rowData);
  //   });

  //   const newData = [topColumnNames, bottomColumnNames, ...rows];
  //   const wb = XLSX.utils.book_new();
  //   const ws = XLSX.utils.json_to_sheet(newData, {
  //     skipHeader: true,
  //   });
  //   XLSX.utils.book_append_sheet(wb, ws, 'MySheet');
  //   XLSX.writeFile(wb, 'iSecure_notes.xlsx');
  // };

  const auditLogs =
    auditLogsQry.data?.auditLogs.map((item: AuditLog) => {
      return {
        ...item,
        createdAt: moment(item.createdAt).format('YYYY-MM-DD hh:mm A'),
      };
    }) ?? [];

  const breadCrumbs = [
    { name: 'MANAGEMENT' },
    { name: 'Admin Management' },
    { name: 'Audit Trial Log' },
  ];

  const onSearch = (filter: Filter) => {
    setFilter(filter);
  };

  return (
    <div className="p-4 text-[#495057] no-scrollbar">
      <BreadCrumbs breadCrumbs={breadCrumbs} />
      <Section outerTitle="Audit Trial Log" innerTitle="Audit Trial Log">
        {!emails.length ? null : (
          <AuditLogFilter onSearch={onSearch} emails={emails} />
        )}
        <AuditLogTable
          data={!auditLogs || auditLogsQry.isFetching ? [] : auditLogs}
          hide={true}
          onClick={() => {}}
        />
        <hr className="my-3" />
        <div className="mt-5 text-sm leading-[2.0]">
          <fieldset className="rounded xs:w-full border p-1 sm:w-2/4 md:w-1/4">
            <legend className="text-sm-start fs-4 float-none w-auto px-3 hover:cursor-pointer">
              Legend:
            </legend>
            <div className="ml-2 flex space-x-1">
              <span>Status</span>
              <table>
                <tbody>
                  <tr>
                    <td className="pl-1">:S</td>
                    <td>: Sucess</td>
                  </tr>
                  <tr>
                    <td className="pl-1">:F</td>
                    <td>: Failed</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </fieldset>
        </div>
      </Section>
    </div>
  );
}
