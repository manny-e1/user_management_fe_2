import { capitalizeFirstLetter } from '@/helper';
import { ISecureNote } from '@/service/isecure-notes';
import { ColumnDef } from '@tanstack/react-table';

export const iSecureNoteListingColums = (
  component: (id: string) => JSX.Element,
  newData: (iSecureNote: ISecureNote, field: string) => JSX.Element
) => {
  return <ColumnDef<ISecureNote>[]>[
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
      header: 'Current Display Status',
      accessorFn: (row) => row.cDisplayStatus,
      accessorKey: 'cDisplayStatus',
      cell: (props) => capitalizeFirstLetter(props.cell.getValue() as string),
    },
    {
      header: 'New Display Status',
      accessorFn: (row) => row.nDisplayStatus,
      accessorKey: 'nDisplayStatus',
      cell: (props) => newData(props.row.original, 'nds'),
    },
    {
      header: 'Image Updated',
      accessorFn: (row) => row.imageUpdated,
      accessorKey: 'imageUpdated',
      cell: (props) => (props.cell.getValue() === 'Y' ? 'Yes' : 'No'),
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
