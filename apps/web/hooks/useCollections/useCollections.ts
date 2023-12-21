import { useQuery } from '@tanstack/react-query';
import { sdk } from '~/sdk';
import { fragments } from '~/sdk/shopify/fragments';
import { Collection } from '~/sdk/shopify/types';

const query = `#graphql
  query GetCollections {
    collections(first: 20) {
      edges {
        node {
         ...collection
        }
      }
    }
  }

  fragment collection on Collection ${fragments['collection']}
`;

export const fetchCollections = async () => {
  const response = await sdk.shopify.customQuery({ query });
  const flatCollections = response.data.collections.edges.map((edge: { node: Collection }) => edge.node);
  return flatCollections.filter(({ slug }: { slug: string }) => !slug.startsWith('hidden-'));
};

type UseCollectionsResponse = { collections: Collection[]; isFetching: boolean };

export const useCollections = (): UseCollectionsResponse => {
  const { data, isFetching } = useQuery(['collections'], fetchCollections, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const collections = (data || []) as unknown as Collection[];

  return {
    collections,
    isFetching,
  };
};
