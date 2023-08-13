import { API_URL } from '@/lib/config';
import { MessageResponse } from './user';

export type UserGroup = {
  idx: number;
  id: string;
  name: string;
  role: string;
};

export async function getUserGroups() {
  const res = await fetch(`${API_URL}/groups`, { cache: 'no-cache' });
  const data: { userGroups: UserGroup[] } | { error: string } =
    await res.json();
  return data;
}

export async function createUserGroup(body: { name: string; roleId: string }) {
  const res = await fetch(`${API_URL}/groups`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data: MessageResponse = await res.json();
  return data;
}

export async function getUserGroupById(id: string) {
  const res = await fetch(`${API_URL}/groups/${id}`);
  const data: { userGroup: UserGroup } | { error: string } = await res.json();
  return data;
}

export async function editUserGroup({
  id,
  name,
  roleId,
}: {
  id: string;
  name: string;
  roleId: string;
}) {
  const res = await fetch(`${API_URL}/groups/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      name,
      roleId,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data: MessageResponse = await res.json();
  return data;
}

export async function deleteUserGroup(id: string) {
  const res = await fetch(`${API_URL}/groups/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data: MessageResponse = await res.json();
  return data;
}
