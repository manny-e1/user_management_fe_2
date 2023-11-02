import { API_URL } from '@/lib/config';
import { MessageResponse } from './user';
import { getHeader } from '@/helper';

export type UserGroup = {
  idx: number;
  id: string;
  name: string;
  role: string;
};

export async function getUserGroups() {
  const authHeader = getHeader('AUTHGET');
  const res = await fetch(`${API_URL}/groups`, authHeader);
  const data: { userGroups: UserGroup[] } | { error: string } =
    await res.json();
  return data;
}

export async function createUserGroup(body: { name: string; roleId: string }) {
  const authHeader = getHeader('AUTHPOST');
  const res = await fetch(`${API_URL}/groups`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: authHeader.headers,
  });
  const data: MessageResponse = await res.json();
  return data;
}

export async function getUserGroupById(id: string) {
  const authHeader = getHeader('AUTHGET');
  const res = await fetch(`${API_URL}/groups/${id}`, authHeader);
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
  const authHeader = getHeader('AUTHPOST');
  const res = await fetch(`${API_URL}/groups/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      name,
      roleId,
    }),
    headers: authHeader.headers,
  });
  const data: MessageResponse = await res.json();
  return data;
}

export async function deleteUserGroup(id: string) {
  const authHeader = getHeader('AUTHPOST');
  const res = await fetch(`${API_URL}/groups/${id}`, {
    method: 'DELETE',
    headers: authHeader.headers,
  });
  const data: MessageResponse = await res.json();
  return data;
}
