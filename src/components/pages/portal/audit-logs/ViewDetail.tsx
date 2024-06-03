'use client';
import BreadCrumbs from '@/components/BreadCrumbs';
import Section from '@/components/Section';
import { capitalizeFirstLetter, formatDate } from '@/helper';
import { usePermission } from '@/hooks/usePermission';
import { getAuditLog } from '@/service/audit-log';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import Swal from 'sweetalert2';

export default function ViewAuditLogPage() {
  const user = usePermission();
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const getAuditLogQry = useQuery({
    queryKey: ['get-audit-log', id],
    queryFn: async () => getAuditLog(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
    cacheTime: 5 * 60 * 1000,
  });

  const breadCrumbs = [
    { name: 'MANAGEMENT' },
    { name: 'Admin Management' },
    { name: 'Audit Trial Log' },
  ];
  const data = getAuditLogQry.data;
  if (data && 'error' in data) {
    return <div>{data.error}</div>;
  }
  const auditLog = data?.auditLog;

  const newValue = auditLog?.newValue && JSON.parse(auditLog?.newValue);
  const prevValue =
    auditLog?.previousValue && JSON.parse(auditLog?.previousValue);
  let changes: Array<{
    key: string;
    newValue: any;
    prevValue: any;
  }> = [];

  if (newValue) {
    changes = Object.entries(newValue)
      .filter(([key, value]) => prevValue?.[key] !== value)
      .map(([key, value]) => ({
        key,
        newValue: value,
        prevValue: prevValue?.[key],
      }));
  } else if (prevValue) {
    changes = Object.entries(prevValue)
      .filter(([key, value]) => newValue?.[key] !== value)
      .map(([key, value]) => ({
        key,
        prevValue: value,
        newValue: newValue?.[key],
      }));
  }
  return (
    <div className="p-4 overflow-y-scroll">
      <BreadCrumbs breadCrumbs={breadCrumbs} />
      <Section outerTitle="Audit Detail" innerTitle="View Audit Detail">
        {getAuditLogQry.isLoading ? (
          <div className="flex justify-center items-center">loading...</div>
        ) : (
          <>
            <table className="w-full">
              <tbody>
                <tr className="h-10">
                  <th className="text-start">Date & Time</th>
                  <td>
                    {moment(auditLog?.createdAt).format('DD-MM-YYYY hh:mm A')}
                  </td>
                </tr>
                <tr className="h-10">
                  <th className="text-start">Performed By</th>
                  <td>{auditLog?.performedBy}</td>
                </tr>
                <tr className="h-10">
                  <th className="text-start">Module</th>
                  <td>{auditLog?.module}</td>
                </tr>
                <tr className="h-10">
                  <th className="text-start">Status</th>
                  <td>{auditLog?.status === 'S' ? 'Success' : 'Failed'}</td>
                </tr>
                <tr className="h-10">
                  <th className="text-start">Description</th>
                  <td>{auditLog?.description}</td>
                </tr>
                <tr className="h-10">
                  <th className="flex">Changes</th>
                  <td>
                    <table>
                      <thead>
                        <tr>
                          <th className="text-start">Field Name</th>
                          <th className="text-start px-6">New Value</th>
                          <th className="text-start px-6">Previous Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {changes.map(({ key, newValue, prevValue }) => (
                          <tr key={key} className="odd:bg-gray-50 h-10">
                            <td className="pl-1">{key}</td>
                            <td className="px-6">{newValue}</td>
                            <td className="px-6">{prevValue}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="w-full flex justify-end gap-2 mt-5">
              <Link
                href="/portal/audit-logs"
                className="text-white bg-[#3b7ddd] hover:bg-[#326abc] rounded-[0.2rem] px-[0.85rem] py-[0.35rem] focus:shadow-[0_0_0_0.2rem_rgba(88,145,226,.5)]"
              >
                Back
              </Link>
            </div>
          </>
        )}
      </Section>
    </div>
  );
}
