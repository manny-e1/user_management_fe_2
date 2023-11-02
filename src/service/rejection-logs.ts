import { API_URL } from '@/lib/config';
import { MessageResponse } from './user';
import { getHeader } from '@/helper';

export type RejectionLog = {
  id: string;
  mid: string;
  reason: string;
  rejectedBy: string;
  rejectedDate: Date | string;
  submissionStatus: string;
};

export async function getRejectLogs(id: string) {
  const authHeader = getHeader('AUTHGET');
  const res = await fetch(`${API_URL}/maintenance/rejection/${id}`, authHeader);
  const data: { rjtLogs: RejectionLog[] } | { error: string } =
    await res.json();

  return data;
}
