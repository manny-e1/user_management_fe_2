'use client';

import Modal from '@/components/Modal';
import PasswordInput from '@/components/PasswordInput';
import { usePermission } from '@/hooks/usePermission';
import { checkResetPasswordToken, resetPassword } from '@/service/user';
import { useMutation, useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function SetPasswordPage() {
  usePermission();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  const [confirmPassword, setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const checkTokenQry = useQuery({
    queryKey: ['check', token],
    queryFn: async () => checkResetPasswordToken(token!, 'activate'),
    enabled: !!token,
  });

  const resetPwdMut = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      if ('error' in data) {
        Swal.fire({
          title: 'Error!',
          text: data.error,
          icon: 'error',
        });
        return;
      }
      Swal.fire({
        title: 'Success!',
        text: "You've successfully activated your account",
        icon: 'success',
      }).then(() => {
        router.push('/login');
      });
    },
  });

  const handleSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    if (password !== confirmPassword) {
      setErr("passwords don't match");
      return;
    }

    if (checkTokenQry.data && 'user' in checkTokenQry.data) {
      resetPwdMut.mutate({
        id: checkTokenQry.data.user.id,
        password: password,
        src: 'activate',
      });
    }
  };
  useEffect(() => {
    if (checkTokenQry.data && 'error' in checkTokenQry.data) {
      if (checkTokenQry.data.error.includes('already activated')) {
        Swal.fire({
          title: 'Error!',
          text: checkTokenQry.data.error,
          icon: 'error',
        }).then((_) => {
          router.push('/login');
        });
        return;
      }
      redirect('/activation-expired');
    }
    if (!token) {
      redirect('/activation-expired');
    }
  }, [token, checkTokenQry.data]);

  if (
    checkTokenQry.isLoading ||
    !token ||
    (checkTokenQry.data && 'error' in checkTokenQry.data)
  ) {
    return null;
  }

  return (
    <main className="flex flex-col pt-4 md:w-full  bg-forgotten items-center  h-screen">
      <Image
        src="/BR Logo Black Tagline.png"
        width={300}
        height={80}
        alt="Bank Logo"
      />
      <h5 className="my-3 text-lg text-center font-semibold">
        Set your Password and activate your new <br /> account
      </h5>
      <div className="flex flex-col sm-w">
        <form onSubmit={handleSubmit} className="flex pt-10 flex-col">
          <div className=" mb-3 flex flex-col">
            <label htmlFor="snewpwd" className="mb-2 font-semibold text-sm">
              New Password
            </label>
            <PasswordInput
              id="snewpwd"
              password={password}
              setPassword={setPassword}
              placeholder="New password"
            />
          </div>
          <div className="mb-3 flex flex-col">
            <label htmlFor="scfmpwd" className="mb-2 font-semibold text-sm">
              Confirm New Password
            </label>
            <PasswordInput
              id="scfmpwd"
              password={confirmPassword}
              setPassword={setConfirmPassword}
              placeholder="Confirm password"
            />

            {err?.includes('match') && <p className="text-red-500">{err}</p>}
          </div>

          <div className="flex justify-center items-center mt-3">
            <button
              type="submit"
              id="≈btnSubmitForgotEmail"
              className="px-4 py-2.5 disabled:cursor-not-allowed disabled:opacity-50 rounded font-normal text-lg text-white bg-blue-500 hover:bg-blue-600 mr-2"
              disabled={resetPwdMut.isLoading}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
