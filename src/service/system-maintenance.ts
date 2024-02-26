import { API_URL } from '@/lib/config';
import { MessageResponse } from './user';
import { getHeader } from '@/helper';
export type SysMaintenance = {
  id: string;
  mid: number;
  submittedAt: Date | string;
  submittedBy: string;
  startDate: Date | string;
  endDate: Date | string;
  iRakyatYN: boolean;
  iBizRakyatYN: boolean;
  iRakyatCN?: boolean;
  iBizRakyatCN?: boolean;
  iRakyatStatus: string;
  iBizRakyatStatus: string;
  submissionStatus: string;
  approvalStatus: string;
  approvedBy: string;
  updatedAt: Date | string;
  isCompleted: boolean;
  rejectReason: string;
};

export type SysMntInput = {
  fromDate: string;
  fromTime: string;
  toDate: string;
  toTime: string;
  iRakyat: boolean;
  iBizRakyat: boolean;
  minDate?: string;
  minTime?: string;
};

export async function getMntLogs() {
  const headers = getHeader('AUTHGET');
  const res = await fetch(`${API_URL}/maintenance`, headers);
  const data: { mntLogs: SysMaintenance[] } | { error: string } =
    await res.json();
  return data;
}

export async function getMntLog(id: string) {
  const headers = getHeader('AUTHGET');
  const res = await fetch(`${API_URL}/maintenance/${id}`, headers);
  const data: { mntLog: SysMaintenance } | { error: string } = await res.json();
  return data;
}

export async function createMntLog(
  body: {
    startDate: string;
    endDate: string;
    iRakyatYN: boolean;
    iBizRakyatYN: boolean;
    submittedBy: string;
  }[]
) {
  const authHeader = getHeader('AUTHPOST');
  const res = await fetch(`${API_URL}/maintenance`, {
    method: 'POST',
    headers: authHeader.headers,
    body: JSON.stringify(body),
  });

  const data: MessageResponse = await res.json();
  return data;
}

export async function updateMntLog({
  id,
  email,
  mntInput,
}: {
  id: string;
  email: string;
  mntInput: SysMntInput;
}) {
  const authHeader = getHeader('AUTHPOST');
  const data: {
    startDate: string;
    endDate: string;
    iRakyatYN: boolean;
    iBizRakyatYN: boolean;
    submittedBy: string;
  } = {
    startDate: new Date(
      mntInput.fromDate + ' ' + mntInput.fromTime
    ).toISOString(),
    endDate: new Date(mntInput.toDate + ' ' + mntInput.toTime).toISOString(),
    iRakyatYN: mntInput.iRakyat,
    iBizRakyatYN: mntInput.iBizRakyat,
    submittedBy: email,
  };

  const res = await fetch(`${API_URL}/maintenance/${id}`, {
    method: 'PUT',
    headers: authHeader.headers,
    body: JSON.stringify(data),
  });

  const resData: MessageResponse = await res.json();
  return resData;
}

export async function approveMntLogs({
  ids,
  email,
}: {
  ids: string[];
  email: string;
}) {
  const authHeader = getHeader('AUTHPOST');
  const res = await fetch(`${API_URL}/maintenance/approve`, {
    method: 'POST',
    headers: authHeader.headers,
    body: JSON.stringify({ ids: ids, email: email }),
  });

  const resData: MessageResponse = await res.json();
  return resData;
}

export async function rejectMntLogs({
  ids,
  email,
  msg,
}: {
  ids: string[];
  email: string;
  msg: string;
}) {
  const authHeader = getHeader('AUTHPOST');
  const res = await fetch(`${API_URL}/maintenance/reject`, {
    method: 'POST',
    headers: authHeader.headers,
    body: JSON.stringify({ ids: ids, email: email, msg: msg }),
  });

  const resData: MessageResponse = await res.json();
  return resData;
}
export async function deleteMntLog({ id }: { id: string }) {
  const authHeader = getHeader('AUTHGET');
  const resp = await fetch(`${API_URL}/maintenance/${id}`, {
    method: 'DELETE',
    headers: authHeader.headers,
  });
  const resData: MessageResponse = await resp.json();
  return resData;
}

export async function completeMntLogs({
  id,
  channel,
}: {
  id: string;
  channel: string;
}) {
  const authHeader = getHeader('AUTHPOST');
  const res = await fetch(`${API_URL}/maintenance/complete`, {
    method: 'POST',
    headers: authHeader.headers,
    body: JSON.stringify({ id: id, channel: channel }),
  });

  const resData: MessageResponse = await res.json();
  return resData;
}
