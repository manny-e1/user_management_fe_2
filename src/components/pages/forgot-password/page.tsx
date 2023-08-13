'use client';
import EmailInput from '@/components/EmailInput';
import Modal from '@/components/Modal';
import { usePermission } from '@/hooks/usePermission';
import { forgotPassword } from '@/service/user';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import Swal from 'sweetalert2';

export default function ForgotPasswordPage() {
  usePermission();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [err, setErr] = useState<string | null>(null);

  const forgotPwdMut = useMutation({
    mutationFn: forgotPassword,
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
        html: `<p>Reset password link will be emailed to you. You need to manually access the email program to retrieve the reset password email<br><br>**You have 30 minutes to complete your reset password</p>`,
        icon: 'success',
      }).then((_) => {
        router.push('/login');
      });
    },
  });

  const handleSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    const emailRegex =
      /^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
    if (!emailRegex.test(email)) {
      setErr('Please enter a valid email');
    }
    forgotPwdMut.mutate(email);
  };

  return (
    <main className="flex flex-col pt-4 md:w-full  bg-forgotten items-center  h-screen">
      <Image
        src="/BR Logo Black Tagline.png"
        width={300}
        height={80}
        alt="Bank Logo"
      />
      <h5 className="my-3 text-lg font-semibold">Forgotten Password?</h5>
      <div className="flex flex-col sm-w">
        <h6 className="text-gray-500 text-center mb-3">
          Enter your Email and a Reset Password Link will be sent to <br /> you
          by email.
        </h6>
        <form onSubmit={handleSubmit} className="flex pt-10 flex-col">
          <label htmlFor="email" className="mb-2 font-semibold text-sm">
            Email
          </label>
          <EmailInput
            id="email"
            email={email}
            setEmail={setEmail}
            placeholder="Enter your email here"
          />
          <p className="text-sm text-red-500">{err}</p>
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
              id="btnSubmitForgotEmail"
              disabled={forgotPwdMut.isLoading}
              className="px-4 py-2.5 disabled:cursor-not-allowed disabled:opacity-50 rounded font-normal text-lg text-white bg-blue-500 hover:bg-blue-600 mr-2"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
