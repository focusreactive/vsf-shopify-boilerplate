/* eslint-disable no-use-before-define */
import { QueryClient, useQuery } from '@tanstack/react-query';
import { sdk } from '~/sdk';
import { getPageQuery } from './getPageQuery';
import { ContentResponse, GeneralContentBlock, RawCollection, RawImage, RawPage, RawProduct } from './types';

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
  return response.data.pages.edges.map((edge: { node: { handle: string } }) => edge.node.handle);
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

type ImageComponent = {
  contentType: 'MediaImage';
  id: string;
  alt: string;
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

type Component = {
  contentType: string;
  fields: { [fieldName: string]: string | number | boolean | ContentComponent };
};

type ContentComponent = Component | ImageComponent | RawPage | RawProduct | RawCollection;

export function processContent(response: ContentResponse): ContentComponent[] {
  return response.map((block) => processBlock(block));
}

export function processBlock(
  block: GeneralContentBlock | RawImage | RawPage | RawProduct | RawCollection,
): ContentComponent {
  switch (block.__typename) {
    case 'MediaImage': {
      return {
        contentType: block.__typename,
        alt: block.alt,
        ...block.image,
      } as ImageComponent;
    }
    case 'Page':
    case 'Product':
    case 'Collection': {
      // Directly return the standard component structure
      return block as ContentComponent;
    }
    case 'Metaobject': {
      const component: Component = {
        contentType: block.type,
        fields: {},
      };

      for (const field of block.fields) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const fieldValue = field.reference ? processBlock(field.reference) : field.value;
        component.fields[field.key] = fieldValue;
      }

      return component;
    }
    default: {
      return block as unknown as Component;
    }
  }
}
