import { getHeader } from '@/helper';
import { API_URL } from '@/lib/config';
import { MessageResponse } from './user';

export type MFAConfig = {
  id: string;
  tid: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date | string;
  updatedAt: Date | string;
  reason: string | null;
  cSMS: number;
  cMO: number;
  cMA: number;
  nSMS: number;
  nMO: number;
  nMA: number;
  maker: string;
  checker: string | null;
  actionTakenTime: Date | null;
};
export type ExtendedMFAConfig = MFAConfig & {
  makerEmail: string;
  checkerEmail: string;
};
export type CreateMFAConfig = Pick<
  MFAConfig,
  'cSMS' | 'cMO' | 'cMA' | 'nSMS' | 'nMO' | 'nMA'
>;
export type UpdateMFAConfig = Omit<CreateMFAConfig, 'maker'>;
export type ReviewMFAConfig = {
  status: 'approved' | 'rejected';
  reason?: string;
};

export async function requestMFAConfig(body: CreateMFAConfig) {
  const authHeader = getHeader('AUTHPOST');
  const res = await fetch(`${API_URL}/mfa-configs`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: authHeader.headers,
  });
  const data: MessageResponse = await res.json();
  return data;
}

export async function getMFAConfigs() {
  const authHeader = getHeader('AUTHGET');
  const res = await fetch(`${API_URL}/mfa-configs`, authHeader);
  const data: { mfaConfigs: MFAConfig[] } | { error: string } =
    await res.json();
  return data;
}

export async function getMFAConfigById(id: string) {
  const authHeader = getHeader('AUTHGET');
  const res = await fetch(`${API_URL}/mfa-configs/${id}`, authHeader);
  const data: { mfaConfig: ExtendedMFAConfig } | { error: string } =
    await res.json();
  return data;
}

export async function getMFAConfigLastUpdatedValue() {
  const authHeader = getHeader('AUTHGET');
  const res = await fetch(`${API_URL}/mfa-configs/last-updated`, authHeader);
  const data: { mfaConfig: MFAConfig } | { error: string } = await res.json();
  return data;
}

export async function updateMFAConfig({
  id,
  body,
}: {
  id: string;
  body: UpdateMFAConfig;
}) {
  const authHeader = getHeader('AUTHPOST');
  const res = await fetch(`${API_URL}/mfa-configs/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: authHeader.headers,
  });
  const data: MessageResponse = await res.json();
  return data;
}

export async function reviewMFAConfig({
  id,
  body,
}: {
  id: string;
  body: ReviewMFAConfig;
}) {
  const authHeader = getHeader('AUTHPOST');
  const res = await fetch(`${API_URL}/mfa-configs/${id}/review`, {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: authHeader.headers,
  });
  const data: MessageResponse = await res.json();
  return data;
}
