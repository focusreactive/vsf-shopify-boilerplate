import { QueryClient, useQuery } from '@tanstack/react-query';
import { SfProduct } from '@vue-storefront/unified-data-model';
import { sdk } from '~/sdk';

const fetchProduct = async (slug: string): Promise<SfProduct> => {
  const data = await sdk.shopify.getProduct({ handle: slug });
  return data;
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
