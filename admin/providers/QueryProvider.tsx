'use client';

import { useState, ReactNode } from 'react';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  getQueryClient,
  createQueryPersister,
  QUERY_CACHE_MAX_AGE,
  QUERY_CACHE_BUSTER,
} from '@/services/react-query/query-client';

interface QueryProviderProps {
  children: ReactNode;
}

export default function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(() => getQueryClient());
  const [persister] = useState(() => createQueryPersister());

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: QUERY_CACHE_MAX_AGE,
        buster: QUERY_CACHE_BUSTER,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            if (query.state.status !== 'success') return false;
            const firstKey = typeof query.queryKey[0] === 'string' ? query.queryKey[0].toUpperCase() : '';
            const blockedKeys = ['USER', 'AUTH', 'PROFILE', 'TOKEN', 'ME'];
            const isBlocked = blockedKeys.some((k) => firstKey.includes(k));
            return !isBlocked;
          },
        },
      }}
    >
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      )}
    </PersistQueryClientProvider>
  );
}
