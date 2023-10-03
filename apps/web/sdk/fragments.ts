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
