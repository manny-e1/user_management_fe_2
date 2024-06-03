import { getHeader } from '@/helper';
import { API_URL } from '@/lib/config';
import { MessageResponse } from './user';

export type OnOrOff = 'on' | 'off';
export type ISecureNote = {
  id: string;
  tid: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date | string;
  updatedAt: Date | string;
  reason: string | null;
  cDisplayStatus: OnOrOff;
  nDisplayStatus: OnOrOff;
  imageUpdated: 'Y' | 'N';
  image: string;
  maker: string;
  checker: string | null;
  actionTakenTime: Date | null;
};

export type ExtendedISecureNote = ISecureNote & {
  makerEmail: string;
  checkerEmail: string;
};

export type ReviewISecureNote = {
  status: 'approved' | 'rejected';
  reason?: string;
};

export async function createISecureNote(formData: FormData) {
  const authHeader = getHeader('FORMDATA');
  const res = await fetch(`${API_URL}/isecure-notes`, {
    method: 'POST',
    body: formData,
    headers: authHeader.headers,
  });
  const data: MessageResponse = await res.json();
  return data;
}

export async function getISecureNotes() {
  const authHeader = getHeader('AUTHGET');
  const res = await fetch(`${API_URL}/isecure-notes`, authHeader);
  const data: { iSecureNotes: ISecureNote[] } | { error: string } =
    await res.json();
  return data;
}

export async function getISecureNoteById(id: string) {
  const authHeader = getHeader('AUTHGET');
  const res = await fetch(`${API_URL}/isecure-notes/${id}`, authHeader);
  const data: { iSecureNote: ExtendedISecureNote } | { error: string } =
    await res.json();
  return data;
}

export async function getISecureNoteLastUpdatedValue() {
  const authHeader = getHeader('AUTHGET');
  const res = await fetch(`${API_URL}/isecure-notes/last-updated`, authHeader);
  const data: { iSecureNote: ISecureNote } | { error: string } =
    await res.json();
  return data;
}

export async function updateISecureNote({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}) {
  const authHeader = getHeader('FORMDATA');
  const res = await fetch(`${API_URL}/isecure-notes/${id}`, {
    method: 'PATCH',
    body: formData,
    headers: authHeader.headers,
  });
  const data: MessageResponse = await res.json();
  return data;
}

export async function reviewISecureNote({
  id,
  body,
}: {
  id: string;
  body: ReviewISecureNote;
}) {
  const authHeader = getHeader('AUTHPOST');
  const res = await fetch(`${API_URL}/isecure-notes/${id}/review`, {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: authHeader.headers,
  });
  const data: MessageResponse = await res.json();
  return data;
}
