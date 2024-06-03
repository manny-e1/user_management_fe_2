'use client';
import { ISecureNote } from '@/service/isecure-notes';
import Table from './Table';
import Link from 'next/link';
import { capitalizeFirstLetter } from '@/helper';
import { iSecureNoteListingColums } from '@/lib/isecure-notes-columns';

function Actions({ id }: { id: string }) {
  return (
    <Link
      href={`/portal/isecure-notes/view-detail/${id}`}
      className="text-blue-500"
    >
      View
    </Link>
  );
}

function actions(id: string) {
  return <Actions id={id} />;
}

function newData(iSecureNote: ISecureNote, field: string) {
  return (
    <div>
      <span
        className={`${
          iSecureNote.cDisplayStatus === iSecureNote.nDisplayStatus
            ? ''
            : 'font-bold text-blue-500 italic'
        }`}
      >
        {capitalizeFirstLetter(iSecureNote.nDisplayStatus)}
      </span>
    </div>
  );
}

export default function ISecureNoteTable({
  data,
  hide,
  onClick,
}: {
  data: ISecureNote[];
  hide: boolean;
  onClick: () => void;
}) {
  return (
    <Table
      data={data}
      columns={iSecureNoteListingColums(actions, newData)}
      route="/portal/isecure-notes/request"
      hide={hide}
      onClick={onClick}
    />
  );
}
