import RequestTransactionPage from '@/components/pages/portal/transaction-limit/request/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transaction Limit',
  description: 'Request transaction page for user management portal',
};

export default function RequestTransaction() {
  return <RequestTransactionPage />;
}
