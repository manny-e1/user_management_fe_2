import { API_URL } from '@/lib/config';
import { Role } from './role';

export type User = {
  idx: number;
  id: string;
  name: string;
  email: string;
  staffId: string;
  userGroup: string;
  status: string;
};

export type MessageResponse = { message: string } | { error: string };

export type Status = 'active' | 'locked';

export async function getUsers() {
  const res = await fetch(`${API_URL}/users`, { cache: 'no-cache' });
  const data: { users: User[] } | { error: string } = await res.json();
  return data;
}

export async function getUserById(id: string) {
  const res = await fetch(`${API_URL}/users/${id}`);
  const data: { user: User } | { error: string } = await res.json();
  return data;
}

export async function editUser({
  id,
  name,
  userGroup,
}: {
  id: string;
  name: string;
  userGroup: string;
}) {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      name,
      userGroup,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data: MessageResponse = await res.json();
  return data;
}

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const res = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data:
    | { user: User & { token: string; role: Role } }
    | { error: string } = await res.json();
  return data;
}

export async function resetPassword({
  id,
  password,
  src,
}: {
  id: string;
  password: string;
  src?: 'activate';
}) {
  const res = await fetch(`${API_URL}/users/reset-password`, {
    method: 'POST',
    body: JSON.stringify({
      id,
      password,
      src,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data: MessageResponse = await res.json();
  return data;
}

export async function createUser(body: {
  name: string;
  email: string;
  userGroup: string;
  staffId: string;
}) {
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data: MessageResponse = await res.json();
  return data;
}

export async function changeUserStatus({
  email,
  status,
}: {
  email: string;
  status: Status;
}) {
  const res = await fetch(`${API_URL}/users/change-status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, email }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data: MessageResponse = await res.json();
  return data;
}

export async function checkUserByUserGroup({
  userGroupId,
  status,
}: {
  userGroupId: string;
  status: Status;
}) {
  const res = await fetch(`${API_URL}/users/check?userGroupId=${userGroupId}`);
  const data: { isThereUser: boolean } | { error: string } = await res.json();
  return data;
}

export async function activateUser(token: string) {
  const res = await fetch(`${API_URL}/users/activate?token=${token}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data: MessageResponse = await res.json();
  return data;
}

export async function forgotPassword(email: string) {
  const res = await fetch(`${API_URL}/users/forgot-password`, {
    method: 'POST',
    body: JSON.stringify({ email }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data: MessageResponse = await res.json();
  return data;
}

export async function checkResetPasswordToken(token: string, src?: 'activate') {
  const url = src
    ? `${API_URL}/users/check-token?token=${token}&src=${src}`
    : `${API_URL}/users/check-token?token=${token}`;
  const res = await fetch(url);
  const data: { user: { id: string } } | { error: string } = await res.json();
  return data;
}

export async function deleteUser(id: string) {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data: MessageResponse = await res.json();
  return data;
}

export async function checkCurrentPassword(body: {
  id: string;
  password: string;
}) {
  const res = await fetch(`${API_URL}/users/check-current-password`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data: MessageResponse = await res.json();
  return data;
}
