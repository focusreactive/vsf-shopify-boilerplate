import { ReactNode } from 'react';
import { UrlObject } from 'node:url';

export type CategoryTreeItem = {
  name: string;
  count?: number;
  href: string | UrlObject;
};

export type CategoryTreeProps = {
  parent?: CategoryTreeItem;
  collections: CategoryTreeItem[];
};

export type CategoryTreeItemProps = Omit<CategoryTreeItem, 'name'> & {
  name: ReactNode;
};
