import { Maybe } from '@vue-storefront/unified-data-model';
import { Product } from '~/sdk/shopify/types';

export type ProductCardProps = {
  name: Maybe<string>;
  description?: Maybe<string>;
  imageUrl?: Maybe<string>;
  imageAlt?: Maybe<string>;
  price?: number;
  compareAtPrice?: number;
  currencyCode?: string;
  slug?: string;
  className?: string;
  priority?: boolean;
  descriptionClassName: string;
  product: Product;
};
