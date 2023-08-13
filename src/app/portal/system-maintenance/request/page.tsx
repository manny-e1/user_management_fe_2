import RequestMaintenancePage from '@/components/pages/portal/system-maintenance/request/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'System Maintenance',
  description: 'Request maintenance page for user management portal',
};

export default function RequestMaintenance() {
  return <RequestMaintenancePage />;
}
