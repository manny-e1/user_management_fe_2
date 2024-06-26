'use client';
import { usePermission } from '@/hooks/usePermission';
import { login } from '@/service/user';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import EmailInput from '../EmailInput';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function SigninPage() {
  usePermission();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const loginMut = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      if ('error' in data) {
        if (data.error.includes('credential')) {
          await Swal.fire({
            title: 'Error!',
            text: 'Invalid email or password',
            icon: 'error',
          });
          return;
        }
        await Swal.fire({
          title: 'Error!',
          text: data.error,
          icon: 'error',
        });
        return;
      } else {
        const { token, ...user } = data.user;
        if (rememberMe) {
          Cookies.set('user', JSON.stringify(user));
          Cookies.set('rememberMe', 'yes');
          Cookies.set('token', token);
        } else {
          Cookies.set('rememberMe', 'no');
          sessionStorage.setItem('user', JSON.stringify(user));
          sessionStorage.setItem(
            'lastActivityTimestamp',
            Date.now().toString()
          );
          sessionStorage.setItem('token', token);
        }
        // secureLocalStorage.setItem('token', token);
        router.push('/');
      }
    },
  });

  async function handleSubmit(evt: FormEvent) {
    evt.preventDefault();
    loginMut.mutate({ email, password });
  }

  return (
    <main className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center px-3 w-full">
        <h1 className="text-3xl font-medium mb-2 text-center">
          Welcome Back to DOBW Admin Portal
        </h1>
        <p className="pb-6 font-light text-[1.09375rem]">
          Sign in to your account to continue
        </p>

        <div className="border rounded md:p-10 p-4 md:w-1/3 w-full shadow-[0_0_0.875rem_0_rgba(33,37,41,.05)]">
          <div className="flex justify-center mb-4 ">
            <Image
              src="/BR Logo White Tagline.png"
              alt=""
              width={150}
              height={80}
              className="rounded-circle"
            />
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-start items-center"
          >
            <div className="!my-4 w-full space-y-2">
              <label htmlFor="email">Email</label>
              <EmailInput
                id="email"
                email={email}
                setEmail={setEmail}
                login={true}
                placeholder="Enter your email"
              />
            </div>
            <div className="!my-4 w-full space-y-2">
              <label htmlFor="password" className="my-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  pattern=".{8,}"
                  placeholder="Enter your password"
                  className="h-12 form-control focus:shadow-[0_0_0_0.2rem_rgba(88,145,226,.5)] outline-none"
                  required
                />
                <button
                  type="button"
                  className="absolute top-[1.0rem] right-[1.0rem]"
                  onMouseDown={() => {
                    setShowPassword(!showPassword);
                  }}
                  onMouseUp={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <small className="mb-2 w-full">
                <Link
                  href="/forgot-password "
                  className="text-[#0d6efd] text-xs underline"
                >
                  Forgot password?
                </Link>
              </small>
            </div>
            <div className="my-4 w-full">
              <label className="text-sm flex items-center">
                <input
                  type="checkbox"
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2 rounded focus:shadow-[0_0_0_0.2rem_rgba(88,145,226,.5)] "
                />
                Remember me next time
              </label>
            </div>
            <button
              disabled={loginMut.isLoading}
              type="submit"
              className="text-white disabled:cursor-not-allowed disabled:opacity-50 bg-[#3b7ddd] hover:bg-[#326abc] rounded-[0.2rem] px-[0.85rem] py-2 focus:shadow-[0_0_0_0.2rem_rgba(88,145,226,.5)]"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
