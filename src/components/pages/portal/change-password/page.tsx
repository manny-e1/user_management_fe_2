'use client';
import Modal from '@/components/Modal';
import PasswordInput from '@/components/PasswordInput';
import Section from '@/components/Section';
import { usePermission } from '@/hooks/usePermission';
import { checkCurrentPassword, resetPassword } from '@/service/user';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import Swal from 'sweetalert2';

export default function ChangePasswordPortalPage() {
  const router = useRouter();
  const user = usePermission();
  const [curPwd, setCurPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmNewPwd, setConfirmNewPwd] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const chgPwdMut = useMutation({
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
        text: 'You’ve successfully changed the Password. Please login using new Password',
        icon: 'success',
      }).then(() => {
        Cookies.remove('user');
        sessionStorage.clear();
        Cookies.remove('rememberMe');
        router.push('/login');
      });
    },
  });

  const checkPwdMut = useMutation({
    mutationFn: checkCurrentPassword,
    onSuccess: (data) => {
      if ('error' in data) {
        Swal.fire({
          title: 'Error!',
          text: data.error,
          icon: 'error',
        });
        return;
      }
      chgPwdMut.mutate({ id: user?.id!, password: newPwd });
    },
  });

  const handleSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    if (newPwd !== confirmNewPwd) {
      setErr("the passwords don't match");
      return;
    }
    setErr(null);
    checkPwdMut.mutate({ id: user?.id!, password: curPwd });
  };

  return (
    <div className="p-4">
      <Section outerTitle="Change Password" innerTitle="Change Password">
        <form
          id="frmChangePswd"
          onSubmit={handleSubmit}
          className="flex flex-wrap text-sm mx-[calc(var(--bs-gutter-x)*-.5)] mt-[calc(var(--bs-gutter-y)*-1)] needs-validation"
        >
          <div className="flex flex-stretch flex-wrap w-full">
            <label
              htmlFor="curpwd"
              className="min-[576px]:w-1/4 py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)] mt-4 w-full"
            >
              Current password
            </label>
            <div className="min-[576px]:w-1/3 px-[calc(var(--bs-gutter-x)*.5)] mt-4 w-full">
              <PasswordInput
                id="curpwd"
                portal={true}
                setPassword={setCurPwd}
                password={curPwd}
                placeholder="Current password"
              />
            </div>
          </div>
          <div className="flex flex-stretch flex-wrap w-full">
            <label
              htmlFor="newpwd"
              className="min-[576px]:w-1/4 py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)] mt-4 w-full"
            >
              New password
            </label>
            <div className="min-[576px]:w-1/3 px-[calc(var(--bs-gutter-x)*.5)] mt-4 w-full">
              <PasswordInput
                id="newpwd"
                portal={true}
                setPassword={setNewPwd}
                password={newPwd}
                placeholder="New password"
              />
            </div>
          </div>
          <div className="flex items-stretch flex-wrap w-full">
            <label
              htmlFor="cfmpwd"
              className="min-[576px]:w-1/4 py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)] mt-4 w-full"
            >
              Confirm new password
            </label>
            <div className="min-[576px]:w-1/3 px-[calc(var(--bs-gutter-x)*.5)] mt-4 w-full">
              <PasswordInput
                id="cfmpwd"
                portal={true}
                setPassword={setConfirmNewPwd}
                password={confirmNewPwd}
                placeholder="Confirm password"
              />
              {err?.includes('match') && <p className="text-red-500">{err}</p>}
              {/* <div id="CheckPasswordMatch" className="col-sm-8 mt-[1px]"></div> */}
            </div>
          </div>

          <div className="w-full mt-7 text-end">
            <div className="min-[576px]:w-[58.333333%] px-[calc(var(--bs-gutter-x)*.5)] mt-4">
              <input
                disabled={checkPwdMut.isLoading || chgPwdMut.isLoading}
                type="submit"
                value="Submit"
                id="btnSaveNewPassword"
                className="disabled:cursor-not-allowed disabled:opacity-50 text-white bg-[#3b7ddd] hover:bg-[#326abc] rounded-[0.2rem] px-[0.85rem] py-[0.35rem] focus:shadow-[0_0_0_0.2rem_rgba(88,145,226,.5)]"
              />
            </div>
          </div>
        </form>
      </Section>
    </div>
  );
}
