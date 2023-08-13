'use client';
import { userListingColums } from '@/lib/user-listing-columns';
import Table from '@/components/tanstack-table/Table';
import { Person } from '@/lib/user-listing-columns';
import {
  Status,
  User,
  changeUserStatus,
  deleteUser,
  forgotPassword,
} from '@/service/user';
import { LuEdit, LuPauseCircle, LuPlayCircle, LuTrash2 } from 'react-icons/lu';
import { TfiReload } from 'react-icons/tfi';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import Modal from '../Modal';
import Swal from 'sweetalert2';

export type Action = {
  id: string;
  status: Status;
  email: string;
};

function Actions({ id, status, email }: Action) {
  const queryClient = useQueryClient();
  const [err, setErr] = useState<{ error: string | null; showModal: Boolean }>({
    error: null,
    showModal: false,
  });
  const statusChangeMut = useMutation({
    mutationFn: changeUserStatus,
    onSuccess: (data) => {
      if ('error' in data) {
        Swal.fire({
          title: 'Error!',
          text: data.error,
          icon: 'error',
        });
        return;
      }
      queryClient.invalidateQueries(['users']);
    },
  });
  const deleteUserMut = useMutation({
    mutationFn: deleteUser,
    onSuccess: (data) => {
      if ('error' in data) {
        Swal.fire({
          title: 'Error!',
          text: data.error,
          icon: 'error',
        });
        return;
      }
      queryClient.invalidateQueries(['users']);
      Swal.fire({
        title: 'Success!',
        text: 'You’ve successfully deleted the user account',
        icon: 'success',
      });
    },
  });
  const pwdResetMut = useMutation({
    mutationFn: forgotPassword,
  });

  const handleStatusChange = () => {
    statusChangeMut.mutate({
      email,
      status: status === 'active' ? 'locked' : 'active',
    });
  };

  const handleDeleteUser = () => {
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to delete?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUserMut.mutate(id);
      }
    });
  };

  const handlePwdReset = () => {
    Swal.fire({
      title: 'Success!',
      html: `<p>
          An email is sent to the user to reset the password
          <br />
          <br />
          *Current passwords remain valid until reset password complete
        </p>`,
      icon: 'success',
    }).then(() => {
      pwdResetMut.mutate(email);
    });
  };

  return (
    <div>
      {status === 'active' ? (
        <div key={`${id}idx`} className="flex gap-3 [&>*]:hover:cursor-pointer">
          <Link
            href={`/portal/users/edit/${id}`}
            className="aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
            aria-disabled={statusChangeMut.isLoading}
          >
            <LuEdit size={18} className="text-blue-500" title='Edit' />
          </Link>
          <LuTrash2
            size={18}
            title='Delete'
            onClick={handleDeleteUser}
            className="text-red-500 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
            aria-disabled={statusChangeMut.isLoading}
          />
          <TfiReload
            size={18}
            title='Password Reset'
            onClick={handlePwdReset}
            className="text-grey-500 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
            aria-disabled={statusChangeMut.isLoading}
          />
          <LuPauseCircle
            size={18}
            title='Active/Lock'
            onClick={handleStatusChange}
            aria-disabled={statusChangeMut.isLoading}
            className="text-orange-500 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
          />
        </div>
      ) : (
        <LuPlayCircle
          size={18}
          className="text-green-500 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 hover:cursor-pointer"
          aria-disabled={statusChangeMut.isLoading}
          onClick={handleStatusChange}
        />
      )}
      {err.showModal && (
        <Modal
          error={!!err.error}
          message={err.error ?? ''}
          onClick={() => setErr({ error: null, showModal: false })}
        />
      )}
    </div>
  );
}

function actions({ id, status, email }: Action) {
  return <Actions id={id} status={status} email={email} />;
}

export default function UserTable({ data }: { data: User[] }) {
  return (
    <Table
      data={data}
      columns={userListingColums(actions)}
      route="/portal/users/create"
    />
  );
}
