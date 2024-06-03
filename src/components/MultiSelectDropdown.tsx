import {
  useState,
  useEffect,
  MouseEvent,
  ChangeEvent,
  useRef,
  SetStateAction,
  Dispatch,
} from 'react';

type Props = {
  formFieldName: string;
  options: Array<string>;
  onChange: (selectedOptions: Array<string>) => void;
  dropdownOpened: boolean;
  setDropdownOpened: Dispatch<SetStateAction<boolean>>;
};

export default function MultiSelectDropdown({
  formFieldName,
  options,
  onChange,
  dropdownOpened,
  setDropdownOpened,
}: Props) {
  const [selectedOptions, setSelectedOptions] = useState<Array<string>>([]);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const onClick = (e: globalThis.MouseEvent) => {
      if (e.target !== dropdownRef.current) {
        setDropdownOpened(false);
      }
    };
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
    };
  }, []);

  useEffect(() => {
    const optionsInputs = options.map((_, i) => {
      return document.getElementById(
        `${formFieldName}${i}`
      ) as HTMLInputElement;
    });
    optionsInputs.forEach((input) => {
      input.checked = true;
    });
    setSelectedOptions(options);
    onChange(options);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    const option = e.target.value;

    const selectedOptionSet = new Set(selectedOptions);

    if (isChecked) {
      selectedOptionSet.add(option);
    } else {
      selectedOptionSet.delete(option);
    }

    const newSelectedOptions = Array.from(selectedOptionSet);

    setSelectedOptions(newSelectedOptions);
    onChange(newSelectedOptions);
  };

  const isSelectAllEnabled = selectedOptions.length < options.length;

  const handleSelectAllClick = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();
    const optionsInputs = options.map((_, i) => {
      return document.getElementById(
        `${formFieldName}${i}`
      ) as HTMLInputElement;
    });
    optionsInputs.forEach((input) => {
      input.checked = true;
    });

    setSelectedOptions([...options]);
    onChange([...options]);
  };

  const isClearSelectionEnabled = selectedOptions.length > 0;
  const isAllSelected = selectedOptions.length === options.length;

  const handleClearSelectionClick = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();

    const optionsInputs = options.map((_, i) => {
      return document.getElementById(
        `${formFieldName}${i}`
      ) as HTMLInputElement;
    });
    optionsInputs.forEach((input) => {
      input.checked = false;
    });

    setSelectedOptions([]);
    onChange([]);
  };

  return (
    <fieldset className="relative" key={formFieldName}>
      {/* <input
        id={`peer${formFieldName}`}
        type="checkbox"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        className="hidden peer"
      /> */}

      <button
        className={`cursor-pointer justify-center after:content-['▼'] after:text-xs after:ml-1 after:inline-flex after:items-center ${
          dropdownOpened ? 'after:-rotate-180' : ''
        } after:transition-transform inline-flex border rounded px-5 py-2 w-80`}
        onClick={(e) => {
          e.nativeEvent.stopImmediatePropagation();
          setDropdownOpened(!dropdownOpened);
        }}
      >
        {isAllSelected ? (
          <span>All</span>
        ) : (
          <span className="ml-1 text-blue-500">{`(${selectedOptions.length} selected)`}</span>
        )}
      </button>
      <div
        id={`div${formFieldName}`}
        ref={dropdownRef}
        onClick={(e) => {
          e.nativeEvent.stopImmediatePropagation();
        }}
        className={`absolute z-50 bg-white border transition-opacity ${
          dropdownOpened
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }   w-full max-h-60 overflow-y-scroll`}
      >
        {
          <ul>
            <li>
              <button
                onClick={handleSelectAllClick}
                disabled={!isSelectAllEnabled}
                className="w-full text-left px-2 py-1 text-blue-600 disabled:opacity-50"
              >
                {'All'}
              </button>
            </li>
            <li>
              <button
                onClick={handleClearSelectionClick}
                disabled={!isClearSelectionEnabled}
                className="w-full text-left px-2 py-1 text-blue-600 disabled:opacity-50"
              >
                {'Clear selection'}
              </button>
            </li>
          </ul>
        }
        <ul>
          {options.map((option, i) => {
            return (
              <li key={option}>
                <label
                  className={`flex items-center whitespace-nowrap cursor-pointer px-2 py-1 transition-colors hover:bg-blue-100`}
                >
                  <input
                    id={`${formFieldName}${i}`}
                    type="checkbox"
                    name={formFieldName}
                    value={option}
                    className="cursor-pointer"
                    onChange={handleChange}
                  />
                  <span className="ml-1">{option}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </fieldset>
  );
}
