import { QueryClient, useQuery } from '@tanstack/react-query';
import { sdk } from '~/sdk';
import { getPageQuery } from './getPageQuery';

// GraphQL query to fetch all pages slugs
const getAllPagesQuery = `#graphql
  {
    pages(first: 50) {
      edges {
        node {
          handle
        }
      }
    }
  }
`;

// Fetches specific page content
export async function fetchPage(slug: string) {
  const query = getPageQuery; // Assumes getPageQuery constructs the appropriate GraphQL query
  const response = await sdk.shopify.customQuery({ query, variables: { slug } });
  return response.data.page;
}

// Fetches all pages' slugs
export async function fetchAllPages() {
  const response = await sdk.shopify.customQuery({ query: getAllPagesQuery });
  return response.data.pages.edges.map((edge) => edge.node.handle);
}

// Updated useContent hook
export function useContent(slug: string) {
  return useQuery(['content', slug], () => fetchPage(slug), {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

// Prefetch content for a specific URL
export async function prefetchContent(slug: string): Promise<QueryClient> {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['content', slug], () => fetchPage(slug));
  return queryClient;
}
