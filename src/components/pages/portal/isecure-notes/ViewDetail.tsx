'use client';
import BreadCrumbs from '@/components/BreadCrumbs';
import Section from '@/components/Section';
import { capitalizeFirstLetter, formatDate } from '@/helper';
import { usePermission } from '@/hooks/usePermission';
import {
  getISecureNoteById,
  reviewISecureNote,
  updateISecureNote,
} from '@/service/isecure-notes';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import Swal from 'sweetalert2';

export default function ViewISecureNotePage() {
  const user = usePermission();
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [selectedImage, setSelectedImage] = useState<File | undefined>(
    undefined
  );

  const handleImageSelect = () => {
    const inputEl = document.createElement('input');
    inputEl.type = 'file';
    inputEl.accept = 'image/*';
    inputEl.onchange = (event: any) => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedImage(file);
      }
    };
    inputEl.click();
  };
  const getMFAConfigQry = useQuery({
    queryKey: ['get-isecure-note', id],
    queryFn: async () => getISecureNoteById(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
    cacheTime: 5 * 60 * 1000,
  });
  const queryClient = useQueryClient();

  const approve = useMutation({
    mutationFn: reviewISecureNote,
    onSuccess: (data) => {
      if ('error' in data) {
        Swal.fire('Error', data.error, 'error');
        return;
      }
      queryClient.invalidateQueries(['isecure-notes']);
      Swal.fire(
        'Approved!',
        'You’ve successfully approved the maintenance request.',
        'success'
      ).then(() => {
        router.push('/portal/isecure-notes');
      });
    },
  });
  const reject = useMutation({
    mutationFn: reviewISecureNote,
    onSuccess: (data) => {
      if ('error' in data) {
        Swal.fire('Error', data.error, 'error');
        return;
      }
      queryClient.invalidateQueries(['isecure-notes']);
      Swal.fire(
        'Rejected!',
        'You’ve successfully rejected the maintenance request.',
        'success'
      ).then(() => {
        router.push('/portal/isecure-notes');
      });
    },
  });

  const updateMut = useMutation({
    mutationFn: updateISecureNote,
    onSuccess: (data) => {
      if ('error' in data) {
        Swal.fire('Error', data.error, 'error');
        return;
      }
      queryClient.invalidateQueries(['isecure-notes']);
      Swal.fire(
        'Approved!',
        'You’ve successfully updated the image.',
        'success'
      ).then(() => {
        router.push('/portal/isecure-notes');
      });
    },
  });

  const handleApprove = () => {
    approve.mutate({
      id: id,
      body: {
        status: 'approved',
      },
    });
  };

  const handleReject = () => {
    Swal.fire({
      title: 'Reject',
      inputLabel: 'Leave a comment:',
      input: 'textarea',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value) {
          reject.mutate({
            id: id,
            body: {
              status: 'rejected',
              reason: result.value,
            },
          });
        } else {
          Swal.fire('Error', 'You must input the reason.', 'error').catch(
            (error) => console.log(error)
          );
        }
      }
    });
  };

  const handleUpdate = () => {
    const formData = new FormData();
    if (selectedImage) {
      formData.append('image', selectedImage);
    }
    updateMut.mutate({
      id,
      formData,
    });
  };

  const breadCrumbs = [{ name: 'MANAGEMENT' }, { name: 'Transaction Limit' }];
  if (getMFAConfigQry.data && 'error' in getMFAConfigQry.data) {
    return <div>{getMFAConfigQry.data.error}</div>;
  }
  const iSecureNote = getMFAConfigQry.data?.iSecureNote;
  const status = iSecureNote?.status;
  const statusTextColor =
    status === 'approved'
      ? 'text-[#3b7ddd]'
      : status === 'rejected'
      ? 'text-red-500'
      : '';

  return (
    <div className="p-4 overflow-y-scroll">
      <BreadCrumbs breadCrumbs={breadCrumbs} />
      <Section outerTitle="OBW Transaction Limit Maintenance" innerTitle="">
        {getMFAConfigQry.isLoading ? (
          <div className="flex justify-center items-center">loading...</div>
        ) : (
          <>
            <span className="flex justify-end mt-[-2rem] mb-8 text-sm">
              Status:
              {status && (
                <p className={`${statusTextColor} font-semibold`}>
                  {capitalizeFirstLetter(status)}
                </p>
              )}
            </span>

            <div className="w-full">
              <div className="w-full flex gap-1 max-md:flex-wrap">
                <div className="flex flex-wrap w-full space-y-1">
                  <label
                    htmlFor="cds"
                    className="py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)]  w-full"
                  >
                    Current Display Status
                  </label>
                  <div className=" px-[calc(var(--bs-gutter-x)*.5)]  w-full">
                    <input
                      type="text"
                      readOnly
                      id="cds"
                      className="form-control"
                      required
                      value={iSecureNote?.cDisplayStatus}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap w-full space-y-1">
                  <label
                    htmlFor="nds"
                    className="py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)]  w-full"
                  >
                    New Display Status
                  </label>
                  <div className=" px-[calc(var(--bs-gutter-x)*.5)]  w-full">
                    <input
                      type="text"
                      readOnly
                      id="nds"
                      className="form-control"
                      value={iSecureNote?.nDisplayStatus}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full my-5 space-y-1">
                <label
                  htmlFor="i-secure-note"
                  className="py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)]  w-full"
                >
                  i-Secure Notes (Image and Text)
                </label>
                <div className="relative mx-[calc(var(--bs-gutter-x)*.5)]">
                  <img
                    src={
                      selectedImage
                        ? URL.createObjectURL(selectedImage)
                        : `http://localhost:5001/uploads/${iSecureNote?.image}`
                    }
                    alt="i-secure note image"
                    id="i-secure-note"
                    className="rounded object-cover"
                  />
                  {user?.role === 'normal user 1' && (
                    <div className="w-full h-full">
                      <div
                        className="absolute top-0 left-0 w-full h-full rounded text-white bg-black  flex justify-center items-center opacity-0 transition-opacity duration-200 ease-in-out hover:opacity-70 hover:cursor-pointer"
                        onClick={handleImageSelect}
                      >
                        <p>Click to select an image</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full flex gap-1 max-md:flex-wrap">
                <div className="flex flex-wrap w-full space-y-1">
                  <label
                    htmlFor="submittedby"
                    className="py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)]  w-full"
                  >
                    Submitted By
                  </label>
                  <div className=" px-[calc(var(--bs-gutter-x)*.5)]  w-full">
                    <input
                      type="text"
                      readOnly
                      id="submittedby"
                      value={iSecureNote?.makerEmail}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap w-full space-y-1">
                  <label
                    htmlFor="submitteddate"
                    className="py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)]  w-full"
                  >
                    Submitted Date & Time
                  </label>
                  <div className=" px-[calc(var(--bs-gutter-x)*.5)]  w-full">
                    <input
                      type="text"
                      readOnly
                      id="submitteddate"
                      className="form-control"
                      value={formatDate(
                        iSecureNote?.createdAt
                          ? new Date(iSecureNote?.createdAt)
                          : undefined
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="w-full flex gap-1 max-md:flex-wrap">
                <div className="flex flex-wrap w-full space-y-1">
                  <label
                    htmlFor="appby"
                    className="py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)]  w-full"
                  >
                    Approved/Rejected By
                  </label>
                  <div className="px-[calc(var(--bs-gutter-x)*.5)]  w-full">
                    <input
                      type="text"
                      id="appby"
                      className="form-control"
                      value={
                        iSecureNote?.checkerEmail
                          ? iSecureNote.checkerEmail
                          : undefined
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-wrap w-full space-y-1">
                  <label
                    htmlFor="upddate"
                    className="py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)]  w-full"
                  >
                    Approved/Rejected Date & Time
                  </label>
                  <div className=" px-[calc(var(--bs-gutter-x)*.5)]  w-full">
                    <input
                      type="text"
                      readOnly
                      id="upddate"
                      className="form-control"
                      value={formatDate(
                        iSecureNote?.actionTakenTime
                          ? new Date(iSecureNote?.actionTakenTime)
                          : undefined
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full flex gap-1 max-md:flex-wrap items-start">
                <div className="flex flex-wrap w-full space-y-1">
                  <label
                    htmlFor="imgUpdated"
                    className="py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)]  w-full"
                  >
                    Image Updated
                  </label>
                  <div className="px-[calc(var(--bs-gutter-x)*.5)]  w-full">
                    <input
                      type="text"
                      id="imgUpdated"
                      className="form-control"
                      readOnly
                      value={iSecureNote?.imageUpdated === 'Y' ? 'Yes' : 'NO'}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap w-full space-y-1">
                  <label
                    htmlFor="rejreason"
                    className="py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)]  w-full"
                  >
                    Rejected Reason
                  </label>
                  <div className="px-[calc(var(--bs-gutter-x)*.5)]  w-full">
                    <textarea
                      id="rejreason"
                      className="form-control"
                      readOnly
                      value={
                        iSecureNote?.reason ? iSecureNote?.reason : undefined
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full flex justify-end gap-2 mt-5">
              <Link
                href="/portal/isecure-notes"
                className="text-white bg-[#3b7ddd] hover:bg-[#326abc] rounded-[0.2rem] px-[0.85rem] py-[0.35rem] focus:shadow-[0_0_0_0.2rem_rgba(88,145,226,.5)]"
                aria-disabled={approve.isLoading || reject.isLoading}
              >
                Back
              </Link>
              {user?.role === 'normal user 1' && (
                <button
                  disabled={updateMut.isLoading || !selectedImage}
                  type="submit"
                  id="btnUpdate"
                  className="text-white bg-[#3b7ddd] hover:bg-[#326abc] rounded-[0.2rem] px-[0.85rem] py-[0.35rem] focus:shadow-[0_0_0_0.2rem_rgba(88,145,226,.5)]"
                  onClick={handleUpdate}
                >
                  Update
                </button>
              )}
              {user?.role === 'manager 1' && status === 'pending' && (
                <>
                  <button
                    disabled={approve.isLoading || reject.isLoading}
                    type="submit"
                    id="btnApproved"
                    className="text-white bg-[#3b7ddd] hover:bg-[#326abc] rounded-[0.2rem] px-[0.85rem] py-[0.35rem] focus:shadow-[0_0_0_0.2rem_rgba(88,145,226,.5)]"
                    onClick={handleApprove}
                  >
                    Approve
                  </button>
                  <button
                    disabled={approve.isLoading || reject.isLoading}
                    type="button"
                    id="btnRejected"
                    className="text-white bg-red-500 hover:bg-red-600 rounded-[0.2rem] px-[0.85rem] py-[0.35rem] focus:shadow-[0_0_0_0.2rem_rgba(88,145,226,.5)]"
                    onClick={handleReject}
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </Section>
    </div>
  );
}
