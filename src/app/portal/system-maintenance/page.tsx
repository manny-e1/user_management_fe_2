import { Metadata } from 'next'
import SystemMaintenancePage from '@/components/pages/portal/system-maintenance/page'

export const metadata:Metadata = {
	title: 'System Maintenance',
	description: 'System Maintenace page for user management portal'
}

export default function SystemMaintenance() {
	return (
		<>
			<SystemMaintenancePage />
		</>
	)
}