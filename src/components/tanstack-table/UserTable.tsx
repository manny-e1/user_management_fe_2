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
  resendActivationEmail,
} from '@/service/user';
import { LuEdit, LuPauseCircle, LuPlayCircle, LuTrash2 } from 'react-icons/lu';
import { TfiReload } from 'react-icons/tfi';
import { FcVoicemail } from 'react-icons/fc';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import Modal from '../Modal';
import Swal from 'sweetalert2';
import { SortingState } from '@tanstack/react-table';

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
  const resendActEmailMut = useMutation({
    mutationFn: resendActivationEmail,
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
        html: `<p>
                An email is sent to the user to activate the account.
          </p>`,
        icon: 'success',
      });
    },
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

  const handlePwdReset = (status: Status) => {
    Swal.fire({
      title: 'Success!',
      html: `<p>
          An email is sent to the user to reset the password.
          ${
            status === 'active'
              ? `<br />
          <br />
          Please note that current passwords remain valid until reset password complete.`
              : ''
          }
        </p>`,
      icon: 'success',
    }).then(() => {
      pwdResetMut.mutate({ email });
    });
  };

  const handleResendActEmail = () => {
    resendActEmailMut.mutate(email);
  };

  return (
    <div>
      {status === 'active' ? (
        <div key={`${id}idx`} className="flex gap-3 [&>*]:hover:cursor-pointer">
          <Link
            href={`/portal/users/edit/${id}`}
            className="aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
            aria-disabled={
              statusChangeMut.isLoading ||
              deleteUserMut.isLoading ||
              pwdResetMut.isLoading
            }
          >
            <LuEdit
              size={18}
              className="text-blue-500 hover:text-blue-600"
              title="Edit"
            />
          </Link>
          <LuTrash2
            size={18}
            title="Delete"
            onClick={handleDeleteUser}
            className="text-red-500 hover:text-red-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
            aria-disabled={
              statusChangeMut.isLoading ||
              deleteUserMut.isLoading ||
              pwdResetMut.isLoading
            }
          />
          <TfiReload
            size={18}
            title="Password Reset"
            onClick={() => handlePwdReset('active')}
            className="text-gray-500 hover:text-gray-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
            aria-disabled={
              statusChangeMut.isLoading ||
              deleteUserMut.isLoading ||
              pwdResetMut.isLoading
            }
          />
          <LuPauseCircle
            size={18}
            title="Lock"
            onClick={handleStatusChange}
            aria-disabled={
              statusChangeMut.isLoading ||
              deleteUserMut.isLoading ||
              pwdResetMut.isLoading
            }
            className="text-orange-500 hover:text-orange-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
          />
        </div>
      ) : status === 'locked' ? (
        <TfiReload
          size={18}
          title="Password Reset"
          onClick={() => handlePwdReset('locked')}
          className="text-gray-500 hover:cursor-pointer hover:text-gray-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
          aria-disabled={pwdResetMut.isLoading}
        />
      ) : (
        <FcVoicemail
          size={18}
          title="Account Activation"
          onClick={handleResendActEmail}
          className="text-gray-500 hover:cursor-pointer hover:text-gray-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
          aria-disabled={resendActEmailMut.isLoading}
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

export default function UserTable({
  data,
  onClick,
}: {
  data: User[];
  onClick: (sorting?: SortingState) => void;
}) {
  return (
    <Table
      data={data}
      columns={userListingColums(actions)}
      route="/portal/users/create"
      onClick={onClick}
    />
  );
}
