'use client';
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  SortingState,
  filterFns,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ChangeEvent,
  InputHTMLAttributes,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FaSortDown, FaSortUp, FaSort } from 'react-icons/fa';
import { RankingInfo, rankItem } from '@tanstack/match-sorter-utils';
import { useRouter } from 'next/navigation';
declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank?: RankingInfo;
    requestStatusRank?: RankingInfo;
    maintenanceStatusRank?: RankingInfo;
  }
}

type MaintenanceFilter = {
  fromDate: string;
  toDate: string;
  requestStatus: string;
  maintenanceStatus: string;
};

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta({
    itemRank,
  });

  return itemRank.passed;
};

const statusFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue('status'), value);

  addMeta({
    itemRank,
  });

  return itemRank.passed;
};

const mntStatusFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const g = value as MaintenanceFilter;
  const { requestStatus, maintenanceStatus, fromDate, toDate } = g;
  const requestStatusRank = rankItem(
    row.getValue('approvalStatus'),
    requestStatus
  );
  const maintenanceStatusRank = rankItem(
    row.getValue('channelStatus'),
    maintenanceStatus
  );
  
  console.log("DEBUG BUG==>",row);

  const period = row.getValue('period') as string;
  const startDate = new Date(period.split('@')[0]);
  const endDate = new Date(period.split('@')[1]);

  const afterStart =
    fromDate === '' ||
    (fromDate != '' && startDate >= new Date(fromDate + ' 00:00:00'));
  const beforeEnd =
    toDate === '' ||
    (toDate != '' && endDate <= new Date(toDate + ' 23:59:59'));

  addMeta({
    requestStatusRank,
    maintenanceStatusRank,
  });

  return (
    requestStatusRank.passed &&
    maintenanceStatusRank.passed &&
    afterStart &&
    beforeEnd
  );
};

export default function Table<T extends { id: string }>({
  data,
  columns,
  route,
  hide = false,
  hideUtility = false,
  onClick,
}: {
  data: T[];
  columns: ColumnDef<T>[];
  route: string;
  hide?: boolean;
  hideUtility?: boolean;
  onClick?: (sorting: SortingState) => void;
}) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [mntFilter, setMntFilter] = useState<MaintenanceFilter>({
    requestStatus: '',
    maintenanceStatus: '',
    fromDate: '',
    toDate: '',
  });
  const isUserTable = route.includes('users');
  const isUserGroupTable = route.includes('user-groups');
  const isTxnTable = route.includes('transaction');
  const isMntTable = route.includes('maintenance');

  const table = useReactTable({
    data,
    columns: columns,
    filterFns: {
      fuzzy: isTxnTable
        ? statusFilter
        : isMntTable
        ? mntStatusFilter
        : fuzzyFilter,
    },
    state: { sorting, globalFilter: isMntTable ? mntFilter : globalFilter },
    onGlobalFilterChange: isTxnTable ? setGlobalFilter : setMntFilter,
    globalFilterFn: isTxnTable
      ? statusFilter
      : isMntTable
      ? mntStatusFilter
      : fuzzyFilter,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  let numberOfFilteredRow = 0;
  for (const key in table.getRowModel().rowsById) {
    if (table.getRowModel().rowsById.hasOwnProperty(key)) {
      numberOfFilteredRow++;
    }
  }
  //console.log(table.getHeaderGroups())
  
  return (
    <div className="p-2  overflow-x-scroll no-scrollbar text-[13px] md:text-sm text-[#495057]">
      <div className="flex justify-between mb-3">
        {isTxnTable ? (
          <FilterStatus onChange={(value) => setGlobalFilter(value)} />
        ) : !hideUtility ? (
          isMntTable ? (
            <MntFilterStatus
              onReqChange={(value) =>
                setMntFilter({
                  ...mntFilter,
                  requestStatus: value,
                })
              }
              onMntChange={(value) =>
                setMntFilter({
                  ...mntFilter,
                  maintenanceStatus: value,
                })
              }
              onFromChange={(value) =>
                setMntFilter({
                  ...mntFilter,
                  fromDate: value,
                })
              }
              onToChange={(value) => {
                setMntFilter({
                  ...mntFilter,
                  toDate: value,
                });
              }}
            />
          ) : (
            <>
              <DebouncedInput
                route={route}
                value={globalFilter ?? ''}
                onChange={(value) => setGlobalFilter(String(value))}
                className="py-0.5 px-1 border rounded border-black"
              />
            </>
          )
        ) : (
          <></>
        )}
        <div className="flex items-center gap-2 ms-2">
          {!hideUtility ? (
            <>
              {!isUserTable ? (
                !isUserGroupTable ? (
                <button
                  id="btnExport"
                  onClick={() => onClick && onClick(sorting)}
                  className="text-white bg-green-500 hover:bg-green-600 rounded-[0.2rem] px-[0.85rem] py-1 focus:shadow-[0_0_0_0.2rem_rgba(188,240,218 ,.5)]"
                >
                  Export
                </button>
                ) : (
                  <></>
                )
              ) : (
                <></>
              )}
              {!hide ? (
                <button
                  id="btnSave"
                  onClick={(e) => router.push(route)}
                  className="text-white bg-[#3b7ddd] hover:bg-[#326abc] rounded-[0.2rem] px-[0.85rem] py-1 focus:shadow-[0_0_0_0.2rem_rgba(88,145,226,.5)]"
                >
                  { isTxnTable ? '+ New Request' : 
                    isMntTable ? '+ Create Schedule': '+ Add' }
                </button>
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="flex overflow-x-auto no-scrollbar overflow-y-hidden scrollbar-thumb-indigo-200 scrollbar-thin scrollbar-thumb-rounded-md scrollbar-track-slate-50">
        <table className="w-full border-2 border-solid border-slate-200 no-scrollbar">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className={`${
                        isTxnTable ? 'isTxnTable border-r-2 border-b-2  border-slate-200' : 
                        !header.isPlaceholder &&
                        'border-r-2 border-b-2  border-slate-200'
                      } px-4 p-1.5 font-semibold border-l-2`}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}

                          className="flex justify-between items-center"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}

                          {header.column.getCanSort() &&
                            ({
                              asc: <FaSortUp />,
                              desc: <FaSortDown />,
                              false: <FaSort className="text-slate-300" />,
                            }[header.column.getIsSorted() as string] ??
                              null)}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr
                  key={row.id}
                  className={`${
                    row.index % 2 === 0 ? 'bg-slate-50' : 'bg-transparent'
                  }`}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        key={cell.id}
                        className="border-r-2 py-1.5 px-2 border-slate-200"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="h-2" />
      <div className="flex flex-col md:flex-row justify-between items-center gap-2 overflow-x-scroll no-scrollbar">
        <span className="flex items-center gap-1">
          <p>
            Showing{' '}
            {!data.length 
              ? 0 
              : !numberOfFilteredRow ? 0 
              : (table.getState().pagination.pageIndex * 10) + 1
            }{' '}
            to{' '}
            {!data.length 
              ? 0 
              : (table.getState().pagination.pageIndex * 10) + table.getRowModel().rows.length
            }{' '}
            {(table.getState().globalFilter.fromDate == "" && table.getState().globalFilter.toDate == "" && 
              table.getState().globalFilter.requestStatus == "" && table.getState().globalFilter.maintenanceStatus == "") || 
              table.getState().globalFilter == "" ? (
                <>
                  of {data.length} entries
                </> 
              ) : (
                  <>
                  {/* isFilter */}
                  of {' '}
                  {numberOfFilteredRow} entries (filtered from {data.length} total entries)
                </> 
              )
            }
          </p>
        </span>
      
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>
          <p className="px-3 py-1 bg-slate-300 flex justify-center items-center border ">
            {table.getState().pagination.pageIndex + 1}
          </p>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterStatus({ onChange }: { onChange: (value: string) => void }) {
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    if (localStorage.getItem('filter')) {
      localStorage.removeItem('filter');
      setStatus('0');
      onChange('0');
    }
  }, []);

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="filterStatus">Status:</label>
      <select
        name="filterStatus"
        id="filterStatus"
        value={status}
        onChange={(e) => {
          setStatus(e.target.value);
          onChange(e.target.value);
        }}
        className="status-filter"
      >
        <option value=""></option>
        <option value="0">Pending</option>
        <option value="1">Approved</option>
        <option value="-">Rejected</option>
      </select>
    </div>
  );
}

function MntFilterStatus({
  onReqChange,
  onMntChange,
  onFromChange,
  onToChange,
}: {
  onReqChange: (value: string) => void;
  onMntChange: (value: string) => void;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
}) {
  const [input, setInput] = useState<MaintenanceFilter>({
    fromDate: '',
    toDate: '',
    requestStatus: '',
    maintenanceStatus: '',
  });

  useEffect(() => {
    if (localStorage.getItem('filter')) {
      localStorage.removeItem('filter');
      setInput({
        ...input,
        requestStatus: 'Pending',
      });
      onReqChange('Pending');
    }
  }, []);

  // Handle Events
  const handleFromDateChange = (value: string) => {
    setInput({
      ...input,
      fromDate: value,
    });
    onFromChange(value);
  };

  const handleToDateChange = (value: string) => {
    setInput({
      ...input,
      toDate: value,
    });
    onToChange(value);
  };

  const handleRequestStatusChange = (value: string) => {
    setInput({
      ...input,
      requestStatus: value,
    });
    onReqChange(value);
  };

  const handleMaintenanceStatusChange = (value: string) => {
    setInput({
      ...input,
      maintenanceStatus: value,
    });
    onMntChange(value);
  };

  const handleClearClick = () => {
    setInput({
      ...input,
      fromDate: '',
      toDate: '',
    });
    onFromChange('');
    onToChange('');
  };

  return (
    // <div className="flex items-center overflow-x-auto scrollbar-thumb-indigo-200 scrollbar-thin scrollbar-thumb-rounded-md scrollbar-track-slate-50 gap-2b text-xs w-4/6">
    <div className="flex items-center gap-2b text-xs">
      <div className="flex items-center">
        <span className="inline-block whitespace-nowrap">From Date:</span>
        <input
          type="date"
          className="form-control cust-form-control mx-1"
          value={input.fromDate}
          onChange={(e) => handleFromDateChange(e.target.value)}
        />
      </div>

      <div className="flex items-center">
        <span className="inline-block whitespace-nowrap">To Date:</span>
        <input
          type="date"
          className="form-control cust-form-control mx-1"
          value={input.toDate}
          onChange={(e) => handleToDateChange(e.target.value)}
        />
      </div>

      <div className="flex items-center mr-3">
        <button
          className="text-white bg-gray-900 rounded-[0.2rem] px-[0.85rem] py-1 active:bg-gray-700"
          style={{ marginTop: '1px' }}
          onClick={() => handleClearClick()}
        >
          Clear
        </button>
      </div>

      <label htmlFor="filterStatus whitespace-nowrap">Request Status:</label>
      <select
        name="filterStatus"
        id="filterStatus"
        value={input.requestStatus}
        onChange={(e) => handleRequestStatusChange(e.target.value)}
        className="status-filter cust-status-filter mx-1"
      >
        <option value=""></option>
        <option value="Pending">Pending</option>
        <option value="Approved">Approved</option>
        <option value="Rejected">Rejected</option>
      </select>

      <label htmlFor="mntFilterStatus whitespace-nowrap">Maintenance Status:</label>
      <select
        name="mntFilterStatus"
        id="mntFilterStatus"
        value={input.maintenanceStatus}
        onChange={(e) => handleMaintenanceStatusChange(e.target.value)}
        className="status-filter cust-status-filter mx-1"
      >
        <option value=""></option>
        <option value="A">Active</option>
        <option value="C">Completed</option>
      </select>
    </div>
  );
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  route,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
  route: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
    if (localStorage.getItem('filter')) {
      localStorage.removeItem('filter');
      setValue('locked');
    }
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <div>
      <label htmlFor={route}>Search: </label>
      <input
        id={route}
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
