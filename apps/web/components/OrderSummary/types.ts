import { PropsWithChildren } from 'react';
import { CartDetails } from '~/sdk/shopify/types';

export type OrderSummaryPropsType = PropsWithChildren & {
  className?: string;
  cart: CartDetails;
  totalItems: { count: number; lines?: number };
};
