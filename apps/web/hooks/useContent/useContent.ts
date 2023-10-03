import { QueryClient, useQuery } from '@tanstack/react-query';
import { sdk } from '~/sdk';

export async function prefetchContent(url: string): Promise<QueryClient> {
  const queryClient = new QueryClient();
  // TODO [>0.2]: revert and switch to Shopify SDK
  await queryClient.prefetchQuery(['content', url], () => sdk.commerce.getContent({ url }));

  return queryClient;
}

/**
 * Hook for getting content data
 * @param {string} url Content url
 */

export function useContent<TFields>(url: string) {
  // TODO [>0.2]: revert and switch to Shopify SDK
  return useQuery(['content', url], () => sdk.commerce.getContent<TFields>({ url }), {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
