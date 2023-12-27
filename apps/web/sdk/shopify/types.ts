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
  compareAtPrice?: {
    amount: number;
  };
};

export type Option = {
  id: string;
  name: string;
  values: string[];
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
  options: Option[];
  variants: Variant[];
};

export type Merchandise = {
  id: string;
  title: string;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  image: {
    url: string;
    altText: string;
  };
  price: {
    amount: number;
    currencyCode: string;
  };
  unitPrice: {
    amount: number;
    currencyCode: string;
  };
  product: {
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
    options: Option[];
    productType: string;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
      maxVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    availableForSale: boolean;
    totalInventory: number;
    variants: EdgeNode<Variant>;
  };
};

export type CartLine = {
  id: string;
  merchandise: Merchandise;
  quantity: number;
};

export type CartDetails = {
  id: string;
  checkoutUrl: string;
  cost: {
    subtotalAmount: {
      amount: number;
    };
    totalTaxAmount: {
      amount: number;
    };
    totalAmount: {
      amount: number;
    };
  };
  lines: CartLine[];
};
