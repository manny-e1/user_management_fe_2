'use client';
import Table from '@/components/tanstack-table/Table';
import { groupListingColums } from '@/lib/group-listing-columns';
import { UserGroup, deleteUserGroup } from '@/service/user-group';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { LuEdit, LuTrash2 } from 'react-icons/lu';
import Swal from 'sweetalert2';

function Actions({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const deleteUserGroupMut = useMutation({
    mutationFn: deleteUserGroup,
    onSuccess: (data) => {
      if ('error' in data) {
        Swal.fire({
          title: 'Error!',
          text: data.error,
          icon: 'error',
        });
        return;
      }
      queryClient.invalidateQueries(['userGroups']);
      Swal.fire({
        title: 'Success!',
        text: 'You’ve successfully deleted the user group',
        icon: 'success',
      });
    },
  });

  const handleDeleteUserGroup = () => {
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
        deleteUserGroupMut.mutate(id);
      }
    });
  };

  return (
    <div key={`${id}idx`} className="flex gap-3 [&>*]:hover:cursor-pointer">
      <Link
        href={`/portal/user-groups/edit/${id}`}
        className="aria-disabled:cursor-not-allowed aria-disabled:opacity-50 "
        aria-disabled={deleteUserGroupMut.isLoading}
      >
        <LuEdit size={18} className="text-blue-500" />
      </Link>
      <LuTrash2
        size={18}
        onClick={handleDeleteUserGroup}
        className="text-red-500 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 "
        aria-disabled={deleteUserGroupMut.isLoading}
      />
    </div>
  );
}

function actions(id: string) {
  return <Actions id={id} />;
}
export default function GroupTable({ data }: { data: UserGroup[] }) {
  return (
    <Table
      data={data}
      columns={groupListingColums(actions)}
      route="/portal/user-groups/create"
    />
  );
}
