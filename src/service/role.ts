import { getHeader } from '@/helper';
import { API_URL } from '@/lib/config';

export type Role =
  | 'admin'
  | 'admin 2'
  | 'normal user 1'
  | 'normal user 2'
  | 'manager 1'
  | 'manager 2';

export type GetRole = {
  id: string;
  name: string;
};

export async function getRoles() {
  const authHeader = getHeader('AUTHGET');
  const res = await fetch(`${API_URL}/roles`, authHeader);
  const data: { roles: GetRole[] } | { error: string } = await res.json();
  return data;
}
