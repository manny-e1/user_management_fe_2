import { Filter } from '@/components/AuditLogFilter';
import { getHeader } from '@/helper';
import { API_URL } from '@/lib/config';
import { MODULES } from '@/lib/constants';

export type AuditLog = {
  tid: number;
  id: string;
  description: string;
  status: 'F' | 'S';
  createdAt: Date | string;
  module: string;
  performedBy: string;
  newValue: string | null;
  previousValue: string | null;
};

export async function getAuditLogs(filter: Filter, performersCount: number) {
  const headers = getHeader('AUTHGET');
  const isAllPerformers = performersCount === filter.performers.length;
  const isAllModules = filter.modules.length === MODULES.length;
  const modules = isAllModules
    ? 'All'
    : encodeURIComponent(JSON.stringify(filter.modules));
  const performedBy = isAllPerformers
    ? 'All'
    : encodeURIComponent(JSON.stringify(filter.performers));
  const res = await fetch(
    `${API_URL}/audit-logs?from=${filter.fromDate}&to=${filter.toDate}&modules=${modules}&performedBy=${performedBy}&status=${filter.status}`,
    headers
  );
  const data: { auditLogs: AuditLog[] } | { error: string } = await res.json();
  return data;
}

export async function getAuditLog(id: string) {
  const headers = getHeader('AUTHGET');
  const res = await fetch(`${API_URL}/audit-logs/${id}`, headers);
  const data: { auditLog: AuditLog } | { error: string } = await res.json();
  return data;
}
