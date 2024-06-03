'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import MultiSelectDropdown from './MultiSelectDropdown';
import { MODULES } from '@/lib/constants';

type Status = 'All' | 'F' | 'S';

export type Filter = {
  fromDate: string;
  toDate: string;
  modules: Array<string>;
  performers: Array<string>;
  status: Status;
};

export function AuditLogFilter({
  onSearch,
  emails,
}: {
  onSearch: (filter: Filter) => void;
  emails: Array<string>;
}) {
  const [input, setInput] = useState<Filter>({
    fromDate: '',
    toDate: '',
    modules: MODULES,
    performers: emails,
    status: 'All',
  });
  const [isModuleDDOpened, setIsModuleDDOpened] = useState(false);
  const [isPerformedByDDOpened, setIsPerformedByDDOpened] = useState(false);

  useEffect(() => {
    if (isModuleDDOpened) {
      setIsPerformedByDDOpened(false);
    } else if (isPerformedByDDOpened) {
      setIsModuleDDOpened(false);
    }
  }, [isModuleDDOpened, isPerformedByDDOpened]);

  const handleFromDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, fromDate: e.target.value });
  };
  const handleToDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, toDate: e.target.value });
  };

  const handleModulesChange = (selectedOptions: Array<string>) => {
    setInput({ ...input, modules: selectedOptions });
  };

  const handlePerformersChange = (selectedOptions: Array<string>) => {
    setInput({ ...input, performers: selectedOptions });
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setInput({ ...input, status: e.target.value as Status });
  };

  return (
    <div>
      <div className="flex items-center">
        <label htmlFor="fromDate" className="inline-block whitespace-nowrap">
          From Date:
        </label>
        <input
          type="date"
          id="fromDate"
          className="form-control cust-form-control mx-1"
          value={input.fromDate}
          onChange={handleFromDateChange}
        />
      </div>
      <div className="flex items-center">
        <label htmlFor="toDate" className="inline-block whitespace-nowrap">
          To Date:
        </label>
        <input
          type="date"
          id="toDate"
          className="form-control cust-form-control mx-1"
          value={input.toDate}
          onChange={handleToDateChange}
        />
      </div>
      <div className="flex items-center">
        <label htmlFor="modules" className="inline-block whitespace-nowrap">
          Module:
        </label>
        <MultiSelectDropdown
          key={'modules'}
          formFieldName={'modules'}
          options={MODULES}
          onChange={handleModulesChange}
          setDropdownOpened={setIsModuleDDOpened}
          dropdownOpened={isModuleDDOpened}
        />
      </div>
      <div className="flex items-center">
        <label htmlFor="performedBy" className="inline-block whitespace-nowrap">
          Performed By:
        </label>
        <MultiSelectDropdown
          key={'performedBy'}
          formFieldName={'performedBy'}
          options={emails}
          onChange={handlePerformersChange}
          setDropdownOpened={setIsPerformedByDDOpened}
          dropdownOpened={isPerformedByDDOpened}
        />
      </div>
      <div className="flex items-center">
        <label htmlFor="logStatus" className="inline-block whitespace-nowrap">
          Status
        </label>
        <select
          name="status"
          id="logStatus"
          value={input.status}
          onChange={handleStatusChange}
          className="form-control cust-form-control mx-1"
        >
          <option value="All">All</option>
          <option value="S">Success</option>
          <option value="F">Failed</option>
        </select>
      </div>
      <button
        onClick={() => {
          console.log({ input });

          onSearch(input);
        }}
      >
        Search
      </button>
    </div>
  );
}
