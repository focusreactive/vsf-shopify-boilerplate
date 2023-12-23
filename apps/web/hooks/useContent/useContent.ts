import { QueryClient, useQuery } from '@tanstack/react-query';
import { sdk } from '~/sdk';

const query = `#graphql
getPages {
  pages(first: 50) {
    edges {
      node {
        id
        title
        handle
        seo {
          title
          description
        }
        content: metafield(namespace: "custom", key: "content") {
          id
          key
          namespace
          value
          references(first: 50) {
            edges {
              node {
                __typename
                ... on Metaobject {
                  id
                  type
                  fields {
                    type
                    key
                    value
                    reference {
                      __typename
                      ... on Collection {
                        id
                        title
                        slug: handle
                      }
                      ... on Product {
                        id
                        title
                        slug: handle
                      }
                      ... on Metaobject {
                        id
                        handle
                        fields {
                          key
                          type
                          value
                          reference {
                            __typename
                            ... on Page {
                              id
                              title
                              slug: handle
                            }
                            ... on MediaImage {
                              id
                              alt
                              image {
                                url
                                altText
                                width
                                height
                                id
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

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
