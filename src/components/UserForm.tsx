'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, use, useEffect, useState } from 'react';
import { UserGroup } from '@/service/user-group';
import { capitalizeEveryWord } from '@/helper';
import { User, createUser, editUser } from '@/service/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import EmailInput from './EmailInput';

export default function UserForm({
  edit,
  user,
  userGroups,
}: {
  edit: boolean;
  user?: User;
  userGroups?: UserGroup[];
}) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [staffID, setStaffID] = useState('');
  const [email, setEmail] = useState('');
  const [userGroup, setUserGroup] = useState('');

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setName(user.name);
      setStaffID(user.staffId);
      setUserGroup(user.userGroup);
    }
  }, [user?.email, user?.name, user?.userGroup, user?.staffId]);

  const queryClient = useQueryClient();

  const editMut = useMutation({
    mutationFn: editUser,
    onSuccess: (data) => {
      if ('error' in data) {
        Swal.fire({
          title: 'Error!',
          text: data.error,
          icon: 'error',
        });
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', user?.id] });
      Swal.fire({
        title: 'Success!',
        text: "You've successfully updated the user account",
        icon: 'success',
      }).then(() => {
        router.push('/portal/users');
      });
    },
  });
  const createMut = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      if ('error' in data) {
        if (data.error.includes('email')) {
          Swal.fire({
            title: 'Error!',
            text: 'Email is used. Please change the Email',
            icon: 'error',
          });
          return;
        }
        Swal.fire({
          title: 'Error!',
          text: data.error,
          icon: 'error',
        });
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['users'] });
      Swal.fire({
        title: 'Success!',
        text: 'You’ve successfully added the user account. An email is sent to the user to activate the account',
        icon: 'success',
      }).then(() => {
        router.push('/portal/users');
      });
      return;
    },
  });

  const cancel = () => {
    router.push('/portal/users');
  };

  const handleSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    if (edit) {
      editMut.mutate({
        id: user!.id,
        name,
        userGroup,
      });
      return;
    }

    createMut.mutate({ email, name, userGroup, staffId: staffID });
    return;
  };

  return (
    <form
      id="frmCreateUser"
      onSubmit={handleSubmit}
      className="flex flex-wrap text-sm mx-[calc(var(--bs-gutter-x)*-.5)] mt-[calc(var(--bs-gutter-y)*-1)] needs-validation"
    >
      <div className="mx-auto w-4/6 block md:w-1/2 px-[calc(var(--bs-gutter-x)*.5)] !mt-[calc(var(--bs-gutter-y))]">
        <div className="flex items-stretch flex-wrap w-full">
          <div className="pb-5 w-full space-y-2">
            <label htmlFor="txtName" className="mb-2">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="txtName"
              placeholder={edit ? '' : 'Name'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="pb-5 w-full space-y-2">
            <label htmlFor="txtUserEmail" className="mb-2">
              Email
            </label>
            <EmailInput
              id="txtUserEmail"
              email={email}
              disabled={edit}
              setEmail={setEmail}
              portal={true}
              placeholder={edit ? '' : 'Email'}
            />
          </div>

          <div className="pb-5 w-full space-y-2">
            <label htmlFor="txtUserEmail" className="mb-2">
              Staff ID
            </label>
            <input
              type="text"
              className="form-control disabled:bg-slate-50"
              id="txtUserStaffId"
              placeholder={edit ? '' : 'Staff ID'}
              required
              disabled={edit}
              value={staffID}
              onChange={(e) => setStaffID(e.target.value)}
            />
          </div>

          <div className="pb-5 w-full space-y-2">
            <label htmlFor="ddlUserGroups" className="mb-2">
              User Groups
            </label>
            <select
              className="form-select"
              id="ddlUserGroups"
              required
              value={userGroup}
              onChange={(e) => setUserGroup(e.target.value)}
            >
              <option value="" disabled={userGroup !== ''}>
                - Select User Group -
              </option>
              {userGroups?.map((userGroup) => (
                <option value={userGroup.id} key={userGroup.id}>
                  {capitalizeEveryWord(userGroup.name)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="px-[calc(var(--bs-gutter-x)*.5)] mt-[calc(var(--bs-gutter-y))] w-full flex justify-center gap-2">
          <button
            type="reset"
            onClick={cancel}
            disabled={editMut.isLoading || createMut.isLoading}
            id="btnBackToUserList"
            className="text-white disabled:cursor-not-allowed disabled:opacity-50 bg-[#6c757d] hover:bg-[#5c636a] rounded-[0.2rem] px-[0.85rem] py-[0.3rem] focus:shadow-[0_0_0_0.2rem_rgba(130,138,145,.5)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              editMut.isLoading ||
              createMut.isLoading ||
              (edit && (!user || !userGroups))
            }
            id="btnSave"
            className="text-white disabled:cursor-not-allowed disabled:opacity-50 bg-[#3b7ddd] hover:bg-[#326abc] rounded-[0.2rem] px-[0.85rem] py-[0.3rem] focus:shadow-[0_0_0_0.2rem_rgba(88,145,226,.5)]"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
