import ViewTransactionPage from '@/components/pages/portal/transaction-limit/view-detail/[id]/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transaction Limit',
  description: 'View transaction page for user management portal',
};

export default function ViewTransaction() {
  return <ViewTransactionPage />;
}
