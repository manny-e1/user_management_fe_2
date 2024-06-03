'use client';
import BreadCrumbs from '@/components/BreadCrumbs';
import Section from '@/components/Section';
import { usePermission } from '@/hooks/usePermission';
import {
  OnOrOff,
  createISecureNote,
  getISecureNoteLastUpdatedValue,
} from '@/service/isecure-notes';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function RequestISecureNotePage() {
  const user = usePermission();
  const router = useRouter();
  const [cDisplayStatus, setCDisplayStatus] = useState<OnOrOff | ''>('');
  const [nDisplayStatus, setNDisplayStatus] = useState<OnOrOff | ''>('');
  const [selectedImage, setSelectedImage] = useState<File | undefined>(
    undefined
  );
  const queryClient = useQueryClient();
  const iSecureNoteMut = useMutation({
    mutationFn: createISecureNote,
    onSuccess: (data) => {
      if ('error' in data) {
        Swal.fire({
          title: 'Error!',
          text: JSON.stringify(data.error),
          icon: 'error',
        });
        return;
      }
      queryClient.invalidateQueries(['isecure-notes']);
      Swal.fire({
        title: 'Success!',
        text: "You've successfully sent the request for approval.",
        icon: 'success',
      }).then(() => {
        router.push('/portal/isecure-notes');
      });
    },
  });

  const lastUpdatedValueQry = useQuery({
    queryKey: ['last-updated-notes'],
    queryFn: getISecureNoteLastUpdatedValue,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (lastUpdatedValueQry.data) {
      if (!('error' in lastUpdatedValueQry.data)) {
        const note = lastUpdatedValueQry.data.iSecureNote;
        setCDisplayStatus(note.nDisplayStatus);
        setNDisplayStatus(note.nDisplayStatus);
      } else {
        setCDisplayStatus('on');
        setNDisplayStatus('on');
      }
    } else {
      setNDisplayStatus('on');
      setCDisplayStatus('on');
    }
  }, [lastUpdatedValueQry.data]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedImage(event.target.files?.[0]);
  };

  const handleSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    const formData = new FormData();
    if (selectedImage) {
      formData.append('image', selectedImage);
    }
    formData.append('nDisplayStatus', nDisplayStatus);
    formData.append('cDisplayStatus', cDisplayStatus);
    iSecureNoteMut.mutate(formData);
  };

  const breadCrumbs = [{ name: 'MANAGEMENT' }, { name: 'i-Secure Notes' }];
  return (
    <div className="p-4">
      <BreadCrumbs breadCrumbs={breadCrumbs} />
      <Section
        outerTitle="OBW i-Secure Notes"
        innerTitle="New Request - i-Secure Notes"
      >
        <form
          id="frmRequestISecureNotes"
          onSubmit={handleSubmit}
          className="flex flex-wrap text-sm mx-[calc(var(--bs-gutter-x)*-.5)] mt-[calc(var(--bs-gutter-y)*-1)] needs-validation space-y-2"
        >
          <div className="w-full flex gap-1 max-md:flex-wrap">
            <div className="flex flex-wrap w-full space-y-1">
              <label
                htmlFor="displayIsecureNotes"
                className="py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)]  w-full"
              >
                Display i-Secure Notes
              </label>
              <div className=" px-[calc(var(--bs-gutter-x)*.5)]  w-full">
                <select
                  name="displayIsecureNotes"
                  id="displayIsecureNotes"
                  value={nDisplayStatus}
                  onChange={(e) => {
                    setNDisplayStatus(e.target.value as OnOrOff);
                  }}
                  className=""
                >
                  <option value="on">Yes</option>
                  <option value="off">No</option>
                </select>
              </div>
            </div>
            <div className="flex flex-wrap w-full space-y-1">
              <label
                htmlFor="isecureImage"
                className="py-[calc(0.3rem_+_1px)] px-[calc(var(--bs-gutter-x)*.5)]  w-full"
              >
                i-Secure Note Image
              </label>
              <div className=" px-[calc(var(--bs-gutter-x)*.5)]  w-full">
                <input
                  type="file"
                  id="isecureImage"
                  accept="image/*"
                  className="form-control"
                  required
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>

          <div className="w-full flex justify-end gap-2">
            <Link
              href="/portal/isecure-notes"
              className=" mt-3 text-white disabled:cursor-not-allowed disabled:opacity-50 bg-[#6c757d] hover:bg-[#5c636a] rounded-[0.2rem] px-[0.85rem] py-[0.35rem] focus:shadow-[0_0_0_0.2rem_rgba(130,138,145,.5)]"
            >
              {' '}
              Cancel{' '}
            </Link>
            <button
              type="submit"
              disabled={iSecureNoteMut.isLoading || !selectedImage}
              id="btnSaveNewPassword"
              className="disabled:cursor-not-allowed disabled:opacity-50 mt-3 text-white bg-[#3b7ddd] hover:bg-[#326abc] rounded-[0.2rem] px-[0.85rem] py-[0.35rem] focus:shadow-[0_0_0_0.2rem_rgba(88,145,226,.5)]"
            >
              {' '}
              Save{' '}
            </button>
          </div>
        </form>
      </Section>
    </div>
  );
}
