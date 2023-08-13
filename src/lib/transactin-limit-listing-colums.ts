import { formatCurrency } from '@/helper';
import { TxnLimit } from '@/service/transaction-limit';
import { ColumnDef } from '@tanstack/react-table';

export const transactionListingColums = (
  component: (id: string) => JSX.Element,
  newData: (txn: TxnLimit, field: string) => JSX.Element
) => {

  return <ColumnDef<TxnLimit>[]>[
    {
      header: 'NO.#',
      accessorFn: (row) => row.tid,
      accessorKey: 'tid',
      cell: (props) => props.cell.getValue(),
    },

    {
      header: 'Date Time',
      accessorFn: (row) => row.createdAt,
      accessorKey: 'createdAt',
      cell: (props) => props.cell.getValue(),
    },
    {
      header: 'Current Trx Limit (RM)',
      enableSorting: false,
      columns: [
        {
          header: 'RIB',
          accessorFn: (row) => row.cRIB,
          accessorKey: 'cRIB',
          cell: (props) => formatCurrency(props.cell.getValue()),
        },
        {
          header: 'RMB',
          accessorFn: (row) => row.cRMB,
          accessorKey: 'cRMB',
          cell: (props) => formatCurrency(props.cell.getValue()),
        },
        {
          header: 'CIB',
          accessorFn: (row) => row.cCIB,
          accessorKey: 'cCIB',
          cell: (props) => formatCurrency(props.cell.getValue()),
        },
        {
          header: 'CMB',
          accessorFn: (row) => row.cCMB,
          accessorKey: 'cCMB',
          cell: (props) => formatCurrency(props.cell.getValue()),
        },
      ],
    },
    {
      header: 'New Trx Limit (RM)',
      enableSorting: false,
      columns: [
        {
          header: 'RIB',
          accessorFn: (row) => row.nRIB,
          accessorKey: 'nRIB',
          cell: (props) => newData(props.row.original, 'rib'),
        },
        {
          header: 'RMB',
          accessorFn: (row) => row.nRMB,
          accessorKey: 'nRMB',
          cell: (props) => newData(props.row.original, 'rmb'),
        },
        {
          header: 'CIB',
          accessorFn: (row) => row.nCIB,
          accessorKey: 'nCIB',
          cell: (props) => newData(props.row.original, 'cib'),
        },
        {
          header: 'CMB',
          accessorFn: (row) => row.nCMB,
          accessorKey: 'nCMB',
          cell: (props) => newData(props.row.original, 'cmb'),
        },
      ],
    },
    {
      header: 'Status',
      accessorFn: (row) => (row.status === -1 ? '-' : row.status),
      accessorKey: 'status',
      cell: (props) =>
        props.cell.getValue() === 0
          ? 'Pending'
          : props.cell.getValue() === 1
          ? 'Approved'
          : 'Rejected',
    },
    {
      header: 'Action',
      enableSorting: false,
      cell: (props) => component(props.row.original.id),
    },
  ];
}
