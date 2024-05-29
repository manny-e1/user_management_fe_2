import { capitalizeFirstLetter, formatCurrency } from '@/helper';
import { MFAConfig } from '@/service/mfa-config';
import { TxnLimit } from '@/service/transaction-limit';
import { ColumnDef } from '@tanstack/react-table';

export const mfaConfigListingColums = (
  component: (id: string) => JSX.Element,
  newData: (mfaConfig: MFAConfig, field: string) => JSX.Element
) => {
  return <ColumnDef<MFAConfig>[]>[
    {
      header: 'NO.#',
      accessorFn: (row) => row.tid,
      accessorKey: 'tid',
      cell: (props) => props.cell.getValue(),
    },
    {
      header: 'Submit Date & Time',
      accessorFn: (row) => row.createdAt,
      accessorKey: 'createdAt',
      cell: (props) => props.cell.getValue(),
    },
    {
      header: 'Current Value',
      enableSorting: false,
      columns: [
        {
          header: 'cMA',
          accessorFn: (row) => row.cMA,
          accessorKey: 'cMA',
          cell: (props) => props.cell.getValue(),
        },
        {
          header: 'cMO',
          accessorFn: (row) => row.cMO,
          accessorKey: 'cMO',
          cell: (props) => props.cell.getValue(),
        },
        {
          header: 'cSMS',
          accessorFn: (row) => row.cSMS,
          accessorKey: 'cSMS',
          cell: (props) => props.cell.getValue(),
        },
      ],
    },
    {
      header: 'New Value',
      enableSorting: false,
      columns: [
        {
          header: 'nMA',
          accessorFn: (row) => row.nMA,
          accessorKey: 'nMA',
          cell: (props) => newData(props.row.original, 'ma'),
        },
        {
          header: 'nMO',
          accessorFn: (row) => row.nMO,
          accessorKey: 'nMO',
          cell: (props) => newData(props.row.original, 'mo'),
        },
        {
          header: 'nSMS',
          accessorFn: (row) => row.nSMS,
          accessorKey: 'nSMS',
          cell: (props) => newData(props.row.original, 'sms'),
        },
      ],
    },
    {
      header: 'Status',
      accessorFn: (row) => row.status,
      accessorKey: 'status',
      cell: (props) => capitalizeFirstLetter(props.cell.getValue() as string),
    },
    {
      header: 'Action',
      enableSorting: false,
      cell: (props) => component(props.row.original.id),
    },
  ];
};
