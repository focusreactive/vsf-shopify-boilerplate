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
  handle
  primaryImage: featuredImage {
    id
    url
    width
    height
    altText
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
