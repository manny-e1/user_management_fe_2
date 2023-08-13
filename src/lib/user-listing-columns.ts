import { Action } from '@/components/tanstack-table/UserTable';
import { Status, User } from '@/service/user';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { ReactNode } from 'react';
export type Person = { idx: number } & User;
export const userListingColums = (component: (action: Action) => JSX.Element) =>
  <ColumnDef<Person>[]>[
    {
      header: '#',
      accessorFn: (row) => row.idx,
      accessorKey: 'idx',
      cell: (props) => props.cell.getValue(),
    },
    {
      header: 'Name',
      accessorFn: (row) => row.name,
      accessorKey: 'name',
      cell: (props) => props.cell.getValue(),
    },
    {
      header: 'Email',
      accessorFn: (row) => row.email,
      accessorKey: 'email',
      cell: (props) => props.cell.getValue(),
    },
    {
      header: 'Staff Id',
      accessorFn: (row) => row.staffId,
      accessorKey: 'staffID',
      cell: (props) => props.cell.getValue(),
    },
    {
      header: 'User group',
      accessorFn: (row) => row.userGroup,
      accessorKey: 'userGroup',
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
      accessorFn: (row) => row.id,
      accessorKey: 'id',
      enableSorting: false,
      cell: (props) =>
        component({
          id: props.getValue() as string,
          status: props.row.original.status as Status,
          email: props.row.original.email,
        }),
    },
  ];
