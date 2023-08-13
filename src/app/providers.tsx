'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

type Props = {
  children?: React.ReactNode;
};

export const Providers = ({ children }: Props) => {
  const [client] = useState(
    new QueryClient({ defaultOptions: { queries: { staleTime: 0 } } })
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
