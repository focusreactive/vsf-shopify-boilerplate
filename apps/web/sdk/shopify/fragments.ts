const variant = `#graphql
{
  id
  title
}
`;

const product = `#graphql
{
  id
  title
  description
  slug: handle
  primaryImage: featuredImage {
    id
    url
    width
    height
    altText
  }
  gallery: images(first: 10) {
    edges {
      node {
        id
        alt: altText
        url
      }
    }
  }
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
    maxVariantPrice {
      amount
      currencyCode
    }
  }
  availableForSale
  totalInventory
  variants(first: 10) {
    edges {
      node {
        ...variant
      }
    }
  }
}

fragment variant on ProductVariant ${variant}
`;

export const fragments = {
  product,
  variant,
};
