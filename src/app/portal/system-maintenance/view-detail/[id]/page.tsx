import ViewMaintenancePage from '@/components/pages/portal/system-maintenance/view-detail/[id]/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'System Maintenance',
  description: 'View maintenance page for user management portal',
};

export default function ViewMaintenance() {
	return (
		<ViewMaintenancePage />
	)
}