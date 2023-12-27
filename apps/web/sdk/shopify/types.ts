export type EdgeNode<TP> = {
  edges: {
    node: TP;
  }[];
};

export type Variant = {
  id: string;
  sku: string;
  title: string;
  currentlyNotInStock: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  quantityAvailable: number;
  price: {
    amount: number;
    currencyCode: string;
  };
};

export type Product = {
  id: string;
  title: string;
  description: string;
  slug: string;
  primaryImage: {
    id: string;
    url: string;
    width: number;
    height: number;
    altText: string;
  };
  gallery: EdgeNode<{
    id: string;
    alt: string;
    url: string;
  }>;
  priceRange: {
    minVariantPrice: {
      amount: number;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: number;
      currencyCode: string;
    };
  };
  availableForSale: boolean;
  totalInventory: number;
  options: {
    id: string;
    name: string;
    values: string[];
  }[];
  variants: EdgeNode<Variant>;
};
