'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import {
  UserGroup,
  createUserGroup,
  editUserGroup,
} from '@/service/user-group';
import type { GetRole as Role } from '@/service/role';
import { capitalizeEveryWord } from '@/helper';
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import Modal from './Modal';
import Swal from 'sweetalert2';

export default function GroupForm({
  edit,
  group,
  roles,
}: {
  edit: boolean;
  group?: UserGroup;
  roles?: Role[];
}) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  const queryClient = useQueryClient();

  useEffect(() => {
    if (group) {
      setName(group.name);
      setRole(group.role);
    }
  }, [group?.name, group?.role]);

  const editMut = useMutation({
    mutationFn: editUserGroup,
    onSuccess: (data) => {
      if ('error' in data) {
        Swal.fire({
          title: 'Error!',
          text: data.error,
          icon: 'error',
        });
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['userGroups'] });
      queryClient.invalidateQueries({ queryKey: ['userGroup', group?.id] });
      Swal.fire({
        title: 'Success!',
        text: "You've successfully updated the user group",
        icon: 'success',
      }).then(() => {
        router.push('/portal/user-groups');
      });
    },
  });
  const createMut = useMutation({
    mutationFn: createUserGroup,
    onSuccess: (data) => {
      if ('error' in data) {
        Swal.fire({
          title: 'Error!',
          text: data.error,
          icon: 'error',
        });
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['userGroups'] });
      Swal.fire({
        title: 'Success!',
        text: "You've successfully added a user group",
        icon: 'success',
      }).then(() => {
        router.push('/portal/user-groups');
      });
    },
  });

  const back = () => {
    router.push('/portal/user-groups');
  };

  const handleSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    if (edit) {
      editMut.mutate({ id: group!.id, name, roleId: role });
      return;
    }
    createMut.mutate({
      name,
      roleId: role,
    });
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
              className="form-control disabled:bg-slate-50"
              id="txtName"
              placeholder={edit ? '' : 'Name'}
              value={name}
              disabled={edit}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="pb-5 w-full space-y-2">
            <label htmlFor="ddlUserRole" className="mb-2">
              Role
            </label>
            <select
              className="form-select"
              id="ddlUserRole"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="" disabled={role !== ''}>
                - Select Role -
              </option>
              {roles?.map((role) => (
                <option value={role.id} key={role.id}>
                  {capitalizeEveryWord(role.name)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="px-[calc(var(--bs-gutter-x)*.5)] mt-[calc(var(--bs-gutter-y))] w-full flex justify-center gap-2">
          <button
            disabled={createMut.isLoading || editMut.isLoading}
            type="reset"
            onClick={back}
            id="btnBackToUserList"
            className="disabled:opacity-50 disabled:cursor-not-allowed text-white bg-[#6c757d] hover:bg-[#5c636a] rounded-[0.2rem] px-[0.85rem] py-[0.3rem] focus:shadow-[0_0_0_0.2rem_rgba(130,138,145,.5)]"
          >
            Back
          </button>
          <button
            disabled={
              createMut.isLoading ||
              editMut.isLoading ||
              (edit && (!group || !roles))
            }
            type="submit"
            id="btnSave"
            className="disabled:opacity-50 disabled:cursor-not-allowed text-white bg-[#3b7ddd] hover:bg-[#326abc] rounded-[0.2rem] px-[0.85rem] py-[0.3rem] focus:shadow-[0_0_0_0.2rem_rgba(88,145,226,.5)]"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
