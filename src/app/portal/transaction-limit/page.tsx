import TransactionLimitPage from '@/components/pages/portal/transaction-limit/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transaction Limit',
  description: 'Transaction Limit list page for user management portal',
};

export default function TransactionLimit() {
  return <TransactionLimitPage />;
}
