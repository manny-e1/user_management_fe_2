'use client';
import BreadCrumbs from '@/components/BreadCrumbs';
import Section from '@/components/Section';
import { usePwdValidityQuery } from '@/hooks/useCheckPwdValidityQuery';
import { usePermission } from '@/hooks/usePermission';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { capitalizeFirstLetter } from '@/helper';
import * as XLSX from 'xlsx';
import moment from 'moment';
import { SortingState } from '@tanstack/react-table';
import { ISecureNote, getISecureNotes } from '@/service/isecure-notes';
import ISecureNoteTable from '@/components/tanstack-table/ISecureNoteTable';

export default function ISecureNotePage() {
  const user = usePermission();
  usePwdValidityQuery(user?.id);
  const iSecureNotesQry = useQuery({
    queryKey: ['isecure-notes'],
    queryFn: getISecureNotes,
    refetchOnWindowFocus: false,
  });

  if (iSecureNotesQry.data && 'error' in iSecureNotesQry.data) {
    return <p>{iSecureNotesQry.data.error}</p>;
  }

  const handleExport = (sorting?: SortingState) => {
    const rows: any[] = [];
    const sortField = sorting?.length ? sorting[0].id : '';
    const sortDesc =
      (sorting?.length ? sorting[0].desc : false) == false ? 1 : -1;
    const topColumnNames: any[] = [
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ];
    const bottomColumnNames: any[] = [
      'No.#',
      'Submit Date & Time',
      'cDisplayStatus',
      'nDisplayStatus',
      'imageUpdated',
      'Status',
    ];

    let data: ISecureNote[] = [];
    if (iSecureNotesQry.data && 'iSecureNotes' in iSecureNotesQry.data) {
      data = iSecureNotesQry.data.iSecureNotes.sort(
        (a: ISecureNote, b: ISecureNote) => {
          if (sortField === 'cDisplayStatus')
            return a.cDisplayStatus.localeCompare(b.cDisplayStatus) * sortDesc;
          else if (sortField === 'nDisplayStatus')
            return a.nDisplayStatus.localeCompare(b.nDisplayStatus) * sortDesc;
          else if (sortField === 'imageUpdated')
            return a.imageUpdated.localeCompare(b.imageUpdated) * sortDesc;
          else if (sortField === 'createdAt')
            return Number(a.createdAt > b.createdAt) * sortDesc;
          else if (sortField === 'status') {
            return a.status.localeCompare(b.status) * sortDesc;
          } else return 1;
        }
      );
    }

    data.forEach((row) => {
      const rowData: any = [];
      rowData.push(row.tid);
      rowData.push(moment(row.createdAt).format('YYYY-MM-DD hh:mm A'));
      rowData.push(capitalizeFirstLetter(row.cDisplayStatus));
      rowData.push(capitalizeFirstLetter(row.nDisplayStatus));
      rowData.push(row.imageUpdated === 'Y' ? 'Yes' : 'No');
      rowData.push(capitalizeFirstLetter(row.status));
      rows.push(rowData);
    });

    const newData = [topColumnNames, bottomColumnNames, ...rows];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(newData, {
      skipHeader: true,
    });
    XLSX.utils.book_append_sheet(wb, ws, 'MySheet');
    XLSX.writeFile(wb, 'iSecure_notes.xlsx');
  };

  const iSecureNotes =
    iSecureNotesQry.data?.iSecureNotes.map((item: ISecureNote) => {
      return {
        ...item,
        createdAt: moment(item.createdAt).format('YYYY-MM-DD hh:mm A'),
      };
    }) ?? [];

  const breadCrumbs = [{ name: 'MANAGEMENT' }, { name: 'i-Secure Notes' }];
  return (
    <div className="p-4 text-[#495057] no-scrollbar">
      <BreadCrumbs breadCrumbs={breadCrumbs} />
      <Section outerTitle="OBW i-Secure Notes" innerTitle="i-Secure Notes">
        <ISecureNoteTable
          data={!iSecureNotes || iSecureNotesQry.isFetching ? [] : iSecureNotes}
          hide={user?.role === 'manager 1'}
          onClick={handleExport}
        />
      </Section>
    </div>
  );
}
