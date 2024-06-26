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

export default function ChangePasswordPage() {
  usePermission();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  const [confirmPassword, setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const checkTokenQry = useQuery({
    queryKey: ['check', token],
    queryFn: async () => checkResetPasswordToken(token!),
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
        text: `You\'ve successfully changed password. Please login using new password`,
        icon: 'success',
      }).then((_) => {
        router.push('/login');
      });
    },
  });

  const handleSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    if (password !== confirmPassword) {
      setErr('Password not matching');
      return;
    }
    setErr('');
    if (checkTokenQry.data && 'user' in checkTokenQry.data) {
      resetPwdMut.mutate({
        id: checkTokenQry.data.user.id,
        password: password,
      });
    }
  };

  useEffect(() => {
    if (!token) {
      redirect('/link-expired');
    } else if (checkTokenQry.data && 'error' in checkTokenQry.data) {
      if (checkTokenQry.data.error.includes('found')) {
        redirect('/user-not-found');
      } else {
        redirect('/link-expired');
      }
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
        src="/BR Logo White Tagline.png"
        width={300}
        height={80}
        alt="Bank Logo"
      />
      <h5 className="my-3 text-lg text-center font-semibold">Reset Password</h5>
      <div className="flex flex-col sm-w">
        <form onSubmit={handleSubmit} className="flex pt-10 flex-col">
          <div className=" mb-3 flex flex-col">
            <label htmlFor="newPwd" className="mb-2 font-semibold text-sm">
              New Password
            </label>
            <PasswordInput
              id="newPwd"
              setPassword={setPassword}
              password={password}
              placeholder="New password"
            />

            {err.includes('must') && <p className="text-red-500">{err}</p>}
          </div>
          <div className="mb-3 flex flex-col">
            <label htmlFor="confpwd" className="mb-2 font-semibold text-sm">
              Confirm New Password
            </label>
            <PasswordInput
              id="confpwd"
              setPassword={setConfirmPassword}
              password={confirmPassword}
              placeholder="Confirm new password"
              comparePassword={password}
            />

            {/* {err.includes('match') && <p className="text-red-500">{err}</p>} */}
          </div>

          <div className="flex justify-center items-center mt-3">
            <Link
              href="/login"
              as="/login"
              className="px-4 py-2.5 rounded font-normal text-lg text-white bg-gray-500 hover:bg-gray-600 mr-2"
            >
              Cancel
            </Link>
            <button
              type="submit"
              id="≈btnSubmitForgotEmail"
              className="px-4 py-2.5 disabled:cursor-not-allowed disabled:opacity-50 rounded font-normal text-lg text-white bg-blue-500 hover:bg-blue-600 mr-2"
              disabled={resetPwdMut.isLoading}
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
