import { API_URL } from '@/lib/config';

export async function checkPasswordValidity(userId: string) {
  const res = await fetch(`${API_URL}/password-histories/${userId}`);
  if (res.status === 204) {
    const data = { error: undefined };
    return data;
  }
  const data: { error?: string } = await res.json();
  return data;
}
