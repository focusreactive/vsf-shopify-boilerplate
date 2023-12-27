import { QueryClient, useQuery } from '@tanstack/react-query';
import { sdk } from '~/sdk';
import { Product } from '~/sdk/shopify/types';

const fetchProduct = async (slug: string): Promise<Product> => {
  return await sdk.shopify.getProduct({ slug });
};

export async function prefetchProduct(slug: string): Promise<QueryClient> {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['product', slug], () => fetchProduct(slug));

  return queryClient;
}

/**
 * Hook for getting product data
 * @param {string} slug Product slug
 */
export function useProduct(slug: string) {
  return useQuery(['product', slug], () => fetchProduct(slug), {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
