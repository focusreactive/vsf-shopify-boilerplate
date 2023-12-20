import { useQuery } from '@tanstack/react-query';
import { sdk } from '~/sdk';
import { PageInfo, Product } from '~/sdk/shopify/types';

export const fetchProducts = async (collection?: string) => {
  return await sdk.shopify.getProducts({ collectionHandle: collection });
};

/**
 * Hook for getting products catalog data, optionally filtered by collection
 */
export const useProducts = (collection?: string): { products: Product[]; isFetching: boolean; pageInfo?: PageInfo } => {
  const fetch = () => fetchProducts(collection);

  const { data, isFetching } = useQuery(['products', collection], fetch, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const products = (data?.products || []) as unknown as Product[];

  return {
    products,
    pageInfo: data?.pageInfo,
    isFetching,
  };
};
