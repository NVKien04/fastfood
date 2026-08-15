import { QueryClient, defaultShouldDehydrateQuery, isServer } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

export const QUERY_CACHE_KEY = 'FASTFOOD_QUERY_CACHE';
export const QUERY_CACHE_MAX_AGE = 1000 * 60 * 60 * 24; // 24 giờ
export const QUERY_CACHE_BUSTER = 'v1.0';

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 phút
        gcTime: QUERY_CACHE_MAX_AGE, // 24 giờ (phải >= maxAge của persister)
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: true,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function createQueryPersister() {
  return createSyncStoragePersister({
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    key: QUERY_CACHE_KEY,
    throttleTime: 1000,
  });
}

export const invalidateListQueries = (...queryKeys: Array<readonly unknown[] | unknown[] | string>) => {
  const queryClient = getQueryClient();
  queryKeys.forEach((queryKey) => {
    queryClient.invalidateQueries({
      queryKey: Array.isArray(queryKey) ? (queryKey as unknown[]) : [queryKey],
    });
  });
};
