import { AuditLog } from '@/service/audit-log';
import { ColumnDef } from '@tanstack/react-table';

export const auditLogListingColumns = (
  component: (id: string) => JSX.Element
) => {
  return <ColumnDef<AuditLog>[]>[
    {
      header: 'NO.#',
      accessorFn: (row) => row.tid,
      accessorKey: 'tid',
      cell: (props) => props.cell.getValue(),
    },
    {
      header: 'Date & Time',
      accessorFn: (row) => row.createdAt,
      accessorKey: 'createdAt',
      cell: (props) => props.cell.getValue(),
    },
    {
      header: 'Performed By',
      accessorFn: (row) => row.performedBy,
      accessorKey: 'performedBy',
      cell: (props) => props.cell.getValue(),
    },
    {
      header: 'Module',
      accessorFn: (row) => row.module,
      accessorKey: 'module',
      cell: (props) => props.cell.getValue(),
    },
    {
      header: 'Description',
      accessorFn: (row) => row.description,
      accessorKey: 'description',
      cell: (props) => props.cell.getValue(),
    },
    {
      header: 'Status',
      accessorFn: (row) => row.status,
      accessorKey: 'status',
      cell: (props) => props.cell.getValue(),
    },
    {
      header: 'Action',
      enableSorting: false,
      cell: (props) => component(props.row.original.id),
    },
  ];
};
