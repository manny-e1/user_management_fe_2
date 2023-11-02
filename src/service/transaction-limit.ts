import { API_URL } from '@/lib/config';
import { MessageResponse } from './user';
import { getHeader } from '@/helper';

export type TxnLimit = {
  id: string;
  tid: number;
  createdAt: Date | string;
  updatedAt: Date;
  status: number;
  cRIB: number;
  cRMB: number;
  cCIB: number;
  cCMB: number;
  nRIB: number;
  nRMB: number;
  nCIB: number;
  nCMB: number;
  msg: string;
  marker: string;
  updateChecker: string | null;
};

export async function getTxnLogs() {
  const authHeader = getHeader('AUTHGET');
  const res = await fetch(`${API_URL}/transactions`, authHeader);
  const data: { txnLogs: TxnLimit[] } | { error: string } = await res.json();
  return data;
}

export async function getTxnById(id: string) {
  const authHeader = getHeader('AUTHGET');
  const res = await fetch(`${API_URL}/transactions/${id}`, authHeader);
  const data: { txnLog: TxnLimit } | { error: string } = await res.json();
  return data;
}

export async function getLastUpdatedValue() {
  const authHeader = getHeader('AUTHGET');
  const res = await fetch(`${API_URL}/transactions/last-updated`, authHeader);
  const data: { txnLog: TxnLimit } | { error: string } = await res.json();
  return data;
}

export async function changeTxnStatus(body: {
  id: string;
  status: number;
  msg?: string;
  checker: string;
}) {
  const authHeader = getHeader('AUTHPOST');
  const { id, ...rest } = body;
  const res = await fetch(`${API_URL}/transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(rest),
    headers: authHeader.headers,
  });
  const data: { updatedTxnLog: TxnLimit } | { error: string } =
    await res.json();
  return data;
}

export async function createTxnLog(body: {
  cCIB: number;
  cCMB: number;
  cRIB: number;
  cRMB: number;
  nCIB: number;
  nCMB: number;
  nRIB: number;
  nRMB: number;
  marker: string;
}) {
  const authHeader = getHeader('AUTHPOST');
  const res = await fetch(`${API_URL}/transactions`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: authHeader.headers,
  });
  const data: MessageResponse = await res.json();
  return data;
}
