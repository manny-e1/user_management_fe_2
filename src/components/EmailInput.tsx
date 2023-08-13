'use client';
import { SetStateAction } from 'jotai';
import { ChangeEvent, Dispatch, useState } from 'react';

export default function EmailInput({
  id,
  email,
  setEmail,
  portal = false,
  login = false,
  disabled,
  placeholder,
}: {
  id: string;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  portal?: boolean;
  login?: boolean;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [valid, setValid] = useState(true);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setEmail(inputValue);
    setValid(event.target.checkValidity());
    const regex =
      /^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

    if (!regex.test(inputValue)) {
      event.target.setCustomValidity(
        'Example valid email will be xxxxx@xxxxx.xxx with an @ sign and a . sign'
      );
    } else {
      event.target.setCustomValidity('');
    }
  };

  return (
    <input
      type="email"
      id={id}
      disabled={disabled}
      value={email}
      onChange={handleChange}
      pattern=".{4,}"
      placeholder={placeholder}
      className={
        login
          ? 'h-12 form-control focus:shadow-[0_0_0_0.2rem_rgba(88,145,226,.5)] outline-none'
          : portal
          ? 'form-control disabled:bg-slate-50'
          : 'border rounded p-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none h-12 placeholder-lg md:w-96 w-full'
      }
      title="Example valid email will be xxxxx@xxxxx.xxx with an @ sign and a . sign"
      required
    />
  );
}
