const variant = `#graphql
{
  id
  sku
  title
  currentlyNotInStock
  selectedOptions {
    name
    value
  }
  quantityAvailable
  price {
    amount
    currencyCode
  }
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
  options {
    id
    name
    values
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
  options {
    id
    name
    values
  }
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
