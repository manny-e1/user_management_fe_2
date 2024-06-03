'use client';
import { ISecureNote } from '@/service/isecure-notes';
import Table from './Table';
import Link from 'next/link';
import { auditLogListingColumns } from '@/lib/audit-log-listing-columns';
import { AuditLog } from '@/service/audit-log';

function Actions({ id }: { id: string }) {
  return (
    <Link
      href={`/portal/audit-logs/view-detail/${id}`}
      className="text-blue-500"
    >
      View
    </Link>
  );
}

function actions(id: string) {
  return <Actions id={id} />;
}

export default function AuditLogTable({
  data,
  hide,
  onClick,
}: {
  data: AuditLog[];
  hide: boolean;
  onClick: () => void;
}) {
  return (
    <Table
      data={data}
      columns={auditLogListingColumns(actions)}
      route="/portal/audit-logs"
      hide={hide}
      onClick={onClick}
    />
  );
}
