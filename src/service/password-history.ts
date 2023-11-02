import { getHeader } from '@/helper';
import { API_URL } from '@/lib/config';

export async function checkPasswordValidity(userId: string) {
  const authHeader = getHeader('AUTHGET');
  const res = await fetch(
    `${API_URL}/password-histories/${userId}`,
    authHeader
  );
  if (res.status === 204) {
    const data = { error: undefined };
    return data;
  }
  const data: { error?: string } = await res.json();
  return data;
}
