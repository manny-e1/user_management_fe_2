'use client';
import { SetStateAction } from 'jotai';
import { ChangeEvent, Dispatch, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function PasswordInput({
  id,
  password,
  setPassword,
  portal = false,
  login = false,
  placeholder,
  comparePassword
}: {
  id: string;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  portal?: boolean;
  login?: boolean;
  placeholder?: string;
  comparePassword?: string;
}) {
  const [valid, setValid] = useState(true);
  const pathname = usePathname();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setPassword(() => inputValue);
    setValid(() => event.target.checkValidity());
    event.target.setCustomValidity('');

    const strRegex = new RegExp(/^(?=.*[A-Za-z0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/i);

    if (inputValue == ""){
      event.target.setCustomValidity('Invalid input.\n' + event.target.validationMessage);
    }
    else if (inputValue.length < 8){
      
      if (pathname.includes('/change-password') || pathname.includes('/set-password')){
        event.target.setCustomValidity('Password must have at least 8 characters.\nNew Password is less than minimum length.\n' + event.target.validationMessage);
      }
      else {
        event.target.setCustomValidity('Password must have at least 8 characters.\n' + event.target.validationMessage);
      }
    }
    else if (!strRegex.test(inputValue)) {

      if (pathname.includes('/change-password') || pathname.includes('/set-password')){
        event.target.setCustomValidity(
          'New Password need to be alphanumeric and either one of the special character allowed: !@#$%^&*\nPlease match the requested format'
        );
      }
      else {
        event.target.setCustomValidity(
          'Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character and at least 8 or more characters.'
        );
      }

    } 
    else if(comparePassword !== undefined){
      if (pathname.includes('/change-password') || pathname.includes('/set-password')){
        if (comparePassword !== null){
          if (event.currentTarget.value !== comparePassword){
            event.currentTarget.setCustomValidity('Confirm Password not matching');
          }
        }
      }
    }
    else {
      event.target.setCustomValidity('');
    }
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    event.target.setCustomValidity('');
  };

  return (
    <input
      type="password"
      id={id}
      value={password}
      onInput={handleInput}
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
