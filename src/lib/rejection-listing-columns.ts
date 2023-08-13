import { RejectionLog } from '@/service/rejection-logs';
import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';

export const rejectionListingColumns = () =>
  <ColumnDef<RejectionLog>[]>[
    {
      header: 'Rejected Date',
      accessorKey: 'rejectedDate',
      cell: (props) => moment(new Date(props.row.original.rejectedDate)).format('YYYY/MM/DD HH:mm:ss'),
    },
	{
		header: 'Submission',
		accessorKey: 'submissionStatus',
		cell: (props) => props.cell.getValue(),
	},
	{
		header: 'RejectedBy',
		accessorKey: 'rejectedBy',
		cell: (props) => props.cell.getValue(),
	},
	{
		header: 'Reason',
		accessorKey: 'reason',
		cell: (props) => props.cell.getValue(),
	},
  ];
