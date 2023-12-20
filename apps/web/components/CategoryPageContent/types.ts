import { PropsWithChildren, ReactNode } from 'react';
import { Product } from '~/sdk/shopify/types';

export interface CategoryPageContentProps extends PropsWithChildren {
  title: string;
  products: Product[];
  totalProducts: number;
  sidebar?: ReactNode;
  itemsPerPage?: number;
}

export interface CategorySidebarProps extends PropsWithChildren {
  isOpen: boolean;
  closeSidebar: () => void;
}
