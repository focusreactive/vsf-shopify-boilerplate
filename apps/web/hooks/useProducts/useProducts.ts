import { useQuery } from '@tanstack/react-query';
import { sdk } from '~/sdk';
import { Collection, PageInfo, Product } from '~/sdk/shopify/types';

export const fetchProducts = async (collection?: string) => {
  return await sdk.shopify.getProducts({ collectionHandle: collection });
};

type UseProductsResponse = { products: Product[]; isFetching: boolean; pageInfo?: PageInfo; collection?: Collection };

/**
 * Hook for getting products catalog data, optionally filtered by collection
 */
export const useProducts = (collection?: string): UseProductsResponse => {
  const fetch = () => fetchProducts(collection);

  const { data, isFetching } = useQuery(['products', collection || 'all'], fetch, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const products = (data?.products || []) as unknown as Product[];

  return {
    products,
    pageInfo: data?.pageInfo,
    collection: data?.collection as Collection,
    isFetching,
  };
};
