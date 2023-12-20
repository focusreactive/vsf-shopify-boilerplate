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
  compareAtPrice {
    amount
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
  productType
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
  variants(first: 50) {
    edges {
      node {
        ...variant
      }
    }
  }
}

fragment variant on ProductVariant ${variant}
`;

const collection = `#graphql
{
  id
  title
  description
  slug: handle
  image {
    url
    altText
  }
}
`;

export const fragments = {
  product,
  variant,
  collection,
};
