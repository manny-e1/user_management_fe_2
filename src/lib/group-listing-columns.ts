import { UserGroup } from '@/service/user-group';
import { ColumnDef } from '@tanstack/react-table';
export const groupListingColums = (component: (id: string) => JSX.Element) =>
  <ColumnDef<UserGroup>[]>[
    {
      header: '#',
      accessorFn: (row) => row.idx,
      accessorKey: 'idx',
      cell: (props) => props.cell.getValue(),
    },
    {
      header: 'Group Name',
      accessorFn: (row) => row.name,
      accessorKey: 'name',
      cell: (props) => props.cell.getValue(),
    },
    {
      header: 'Role',
      accessorFn: (row) => row.role,
      accessorKey: 'role',
      cell: (props) => props.cell.getValue(),
    },
    {
      header: 'Action',
      enableSorting: false,
      cell: (props) => component(props.row.original.id),
    },
  ];
