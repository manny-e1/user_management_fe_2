'use client';
import { SetStateAction } from 'jotai';
import { ChangeEvent, Dispatch, useEffect, useState } from 'react';

export default function PasswordInput({
  id,
  password,
  setPassword,
  portal = false,
  login = false,
  placeholder,
}: {
  id: string;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  portal?: boolean;
  login?: boolean;
  placeholder?: string;
}) {
  const [valid, setValid] = useState(true);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setPassword(() => inputValue);
    setValid(() => event.target.checkValidity());
    const regex =
      /^(?=.*[a-z])(?=.*[=A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$/;
    if (!regex.test(inputValue)) {
      event.target.setCustomValidity(
        'Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character and at least 8 or more characters.'
      );
    } else {
      event.target.setCustomValidity('');
    }
  };

  return (
    <input
      type="password"
      id={id}
      value={password}
      onChange={handleChange}
      pattern=".{8,}"
      placeholder={placeholder}
      className={
        login
          ? 'h-12 form-control focus:shadow-[0_0_0_0.2rem_rgba(88,145,226,.5)] outline-none'
          : portal
          ? 'form-control'
          : 'border rounded p-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none h-12 placeholder-lg md:w-96 w-full'
      }
      title="Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character."
      required
    />
  );
}
