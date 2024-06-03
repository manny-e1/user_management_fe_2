import ViewAuditLogPage from '@/components/pages/portal/audit-logs/ViewDetail';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Audit Log',
  description: 'View audit log page for admin portal',
};

export default function ViewAuditLog() {
  return <ViewAuditLogPage />;
}
