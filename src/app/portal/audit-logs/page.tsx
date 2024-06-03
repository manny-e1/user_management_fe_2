import AuditLogPage from '@/components/pages/portal/audit-logs/Home';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Audit Logs',
  description: 'Audit log list page for admin portal',
};

export default function AuditLog() {
  return <AuditLogPage />;
}
