'use client';
import { useEffect, useState } from 'react';
import { usePermission } from '@/hooks/usePermission';
import * as XLSX from 'xlsx';
import moment from 'moment';
import Swal from 'sweetalert2';
import Section from '@/components/Section';
import BreadCrumbs from '@/components/BreadCrumbs';
import SystemMaintenanceTable from '@/components/tanstack-table/SystemMaintenanceTable';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  SysMaintenance,
  approveMntLogs,
  getMntLogs,
  rejectMntLogs,
} from '@/service/system-maintenance';
import { usePwdValidityQuery } from '@/hooks/useCheckPwdValidityQuery';
import { SortingState } from '@tanstack/react-table';

export default function SystemMaintenancePage() {
  const user = usePermission();
  const [xlData, setXlData] = useState<any[]>([]);

  const queryClient = useQueryClient();

  usePwdValidityQuery(user?.id);

  const mntLogsQry = useQuery({
    queryKey: ['system-maintenance'],
    queryFn: getMntLogs,
    refetchOnWindowFocus: false,
  });

  // Mutations
  const approveMut = useMutation({
    mutationFn: approveMntLogs,
    onSuccess: async (data) => {
      if ('error' in data) {
        await Swal.fire({
          title: 'Error!',
          text: data.error,
          icon: 'error',
        });
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['system-maintenance'] });
      await Swal.fire({
        title: 'Success!',
        text: "You've successfully approved the system maintenance schedule.",
        icon: 'success',
      });
    },
  });

  const rejectMut = useMutation({
    mutationFn: rejectMntLogs,
    onSuccess: async (data) => {
      if ('error' in data) {
        await Swal.fire({
          title: 'Error!',
          text: data.error,
          icon: 'error',
        });
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['system-maintenance'] });
      await Swal.fire({
        title: 'Success!',
        text: "You've successfully rejected the system maintenance schedule.",
        icon: 'success',
      });
    },
  });

  if (mntLogsQry.data && 'error' in mntLogsQry.data) {
    return <p>{mntLogsQry.data.error}</p>;
  }

  // Handle events
  const handleApprove = async () => {
    const ids: string[] = [];
    document
      .querySelectorAll(`input[type=checkbox]:checked`)
      .forEach((item) => {
        ids.push(item.getAttribute('id') ?? '');
      });

    if (ids.length === 0) {
      await Swal.fire(
        'Error',
        'You must select at least one maintenance to approve.',
        'error'
      );
      return;
    }

    approveMut.mutate({
      ids: ids,
      email: user?.email ?? '',
    });
  };

  const handleReject = async () => {
    const ids: string[] = [];
    document
      .querySelectorAll(`input[type=checkbox]:checked`)
      .forEach((item) => {
        ids.push(item.getAttribute('id') ?? '');
      });

    if (ids.length === 0) {
      await Swal.fire(
        'Error',
        'You must select at least one maintenance to reject.',
        'error'
      );
      return;
    }

    await Swal.fire({
      title: 'Reject',
      inputLabel: 'Please provide rejection reason:',
      input: 'textarea',
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (result.value) {
          console.log({ value: result.value });
          const reason = result.value as string;
          rejectMut.mutate({
            ids: ids,
            email: user?.email ?? '',
            msg: reason,
          });
        } else {
          Swal.fire('Error', 'You must input the reason.', 'error')
            .catch((error) => console.log(error));
        }
      }
    });
  };

  const handleExport = (sorting?: SortingState) => {
    const rows: any[] = [];
    const sortField = sorting?.length ? sorting[0].id : '';
    const sortDesc = (sorting?.length ? sorting[0].desc : false) == false ? 1 : -1;
    const topColumnNames: any[] = ['No.#', 'Maintenance Period', 'Maintenance Channel', 'Submission', 'Request Status', 'Submit Date'];
    
    let data: SysMaintenance[] = [];
    if (mntLogsQry.data && 'mntLogs' in mntLogsQry.data) {
      data = mntLogsQry.data.mntLogs.sort((a: SysMaintenance, b: SysMaintenance) => {
        if (sortField === 'period') {
          const periodA = moment(a.startDate).format('YYYY-MM-DD HH:mm') + '@' + moment(a.endDate).format('YYYY-MM-DD HH:mm');
          const periodB = moment(b.startDate).format('YYYY-MM-DD HH:mm') + '@' + moment(b.endDate).format('YYYY-MM-DD HH:mm');

          return periodA.localeCompare(periodB) * sortDesc;
        }
        else if (sortField === 'submissionStatus') return a.submissionStatus.localeCompare(b.submissionStatus) * sortDesc;
        else if (sortField === 'approvalStatus') return a.approvalStatus.localeCompare(b.approvalStatus) * sortDesc;
        else if (sortField === 'submittedAt') return new Date(a.submittedAt).toISOString().localeCompare(new Date(b.submittedAt).toISOString()) * sortDesc;
        else return 1;
      });
    }

    data.forEach((row) => {
      const rowData: any = [];
      let channel = "";
      rowData.push(row.mid);
      rowData.push(moment(row.startDate).format('DD/MM/YYYY HH:mm') + ' - ' + moment(row.endDate).format('DD/MM/YYYY HH:mm'));
      
      if (row.iRakyatYN) {
        channel += "i-Rakyat";
        if (row.iRakyatStatus == "A" || row.iRakyatStatus == "CC") channel += "(Active)";
        else if(row.iRakyatStatus == "C") channel += "(Complete)";
      }

      if(row.iBizRakyatYN) {
        if (row.iRakyatYN)  channel += ", ";
        channel += "i-BizRakyat";
        if (row.iBizRakyatStatus == "A" || row.iBizRakyatStatus == "CC") channel += "(Active)";
        else if(row.iBizRakyatStatus == "C") channel += "(Complete)";
      }

      rowData.push(channel);
      rowData.push(row.submissionStatus);
      rowData.push(row.approvalStatus);
      rowData.push(moment(row.submittedAt).format('DD/MM/YYYY HH:mm:ss'));
      rows.push(rowData);
    });

    const newData = [topColumnNames, ...rows];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(newData, {
      skipHeader: true,
    });
    XLSX.utils.book_append_sheet(wb, ws, 'MySheet');
    XLSX.writeFile(wb, 'System Maintenance.xlsx');
  };

  // Maintence Data which is showing to table
  const mntLogs = mntLogsQry.data?.mntLogs ?? [];
  const breadCrumbs = [{ name: 'MANAGEMENT' }, { name: 'System Maintenance' }];

  return (
    <div className="p-4 text-[#495057] no-scrollbar">
      <BreadCrumbs breadCrumbs={breadCrumbs} />
      <Section
        outerTitle="OBW System Maintenance"
        innerTitle="System Maintenace"
      >
        <SystemMaintenanceTable
          onClick={handleExport}
          data={mntLogsQry.isFetching ? [] : mntLogs}
          hide={user?.role === 'manager 2'}
        />
        {user?.role === 'manager 2' && (
          <>
            <div className="flex justify-end gap-2">
              <button
                type="submit"
                id="btnApproved"
                className="text-white bg-[#3b7ddd] hover:bg-[#326abc] rounded-[0.2rem] px-[0.75rem] py-[0.25rem] focus:shadow-[0_0_0_0.2rem_rgba(88,145,226,.5)]"
                onClick={handleApprove}
              >
                Approve
              </button>
              <button
                type="button"
                id="btnRejected"
                className="text-white bg-red-500 hover:bg-red-600 rounded-[0.2rem] px-[0.75rem] py-[0.25rem] focus:shadow-[0_0_0_0.2rem_rgba(88,145,226,.5)]"
                onClick={handleReject}
              >
                Reject
              </button>
            </div>
          </>
        )}
        <hr className="my-3" />
        <div className="mt-5 text-sm leading-[2.0]">
          <fieldset className="rounded xs:w-full border p-1 sm:w-2/4 md:w-2/4">
            <legend className="text-sm-start fs-4 float-none w-auto px-3 hover:cursor-pointer">
              Legend for Submission Status:
            </legend>
            <table>
              <tbody>
                <tr>
                  <td className="pl-1">New</td>
                  <td>: New request of system maintenance.</td>
                </tr>
                <tr>
                  <td className="pl-1">Edit</td>
                  <td>: Any update on the record Eg. Extension of completion time.</td>
                </tr>
                <tr>
                  <td className="pl-1">Delete</td>
                  <td>: Delete of request by normal user.</td>
                </tr>
                <tr>
                  <td className="pl-1">Marked</td>
                  <td>: Marked as completed if complete earlier than actual scheduled time.</td>
                </tr>
                <tr>
                  <td className="pl-1">RTP</td>
                  <td>: Real-Time Payment.</td>
                </tr>
                <tr>
                  <td className="pl-1">CS</td>
                  <td>: Consent (AutoDebit)</td>
                </tr>
              </tbody>
            </table>
          </fieldset>
        </div>
      </Section>
    </div>
  );
}
