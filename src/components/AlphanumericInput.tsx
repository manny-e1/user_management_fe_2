'use client';
import { SetStateAction } from 'jotai';
import { ChangeEvent, Dispatch, useState } from 'react';

export default function AlphanumericInput({
  id,
  value,
  setValue,
  disabled,
  placeholder
}: {
  id: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [valid, setValid] = useState(true);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setValue(() => inputValue);
    setValid(() => event.target.checkValidity());
    event.target.setCustomValidity('');

    const alphanumericRegex = /^[a-zA-Z0-9]+$/;

    if (inputValue == ""){
      event.target.setCustomValidity(event.target.validationMessage);
    } else if (!alphanumericRegex.test(inputValue)) {
        event.target.setCustomValidity('Only alphanumeric values are allowed'); 
    } else {
      event.target.setCustomValidity('');
    }
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    event.target.setCustomValidity('');
  };

  return (
    <input
        type="text"
        id={id}
        value={value}
        disabled={disabled}
        onInput={handleInput}
        onChange={handleChange}
        placeholder={placeholder}
        className="form-control disabled:bg-slate-50"
        required
    />
  );
}
