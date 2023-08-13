import { API_URL } from "@/lib/config";
import { MessageResponse } from './user';

export type RejectionLog = {
	id: string,
	mid: string,
	reason: string,
	rejectedBy: string,
	rejectedDate: Date | string,
	submissionStatus: string
}

export async function getRejectLogs(id: string) {
	const res = await fetch(`${API_URL}/maintenance/rejection/${id}`, { cache: 'no-cache' });
	const data: { rjtLogs: RejectionLog[] } | { error: string } = await res.json();

	return data;
}
