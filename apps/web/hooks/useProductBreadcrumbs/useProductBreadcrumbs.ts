import { useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import type { Breadcrumb } from '~/components';
import { Product } from '~/sdk/shopify/types';

/**
 * Hook for retrieving breadcrumbs.
 */
export function useProductBreadcrumbs(product?: Product) {
  const { t } = useTranslation();
  const breadcrumbs = useMemo<Breadcrumb[]>(() => {
    if (!product) {
      return [{ name: t('home'), link: '/' }];
    }

    return [
      { name: t('home'), link: '/' },
      product.productType && { name: product.productType, link: product.productType },
      { name: product.title as string, link: `#` },
    ].filter(Boolean) as Breadcrumb[];
  }, [product]);

  return {
    breadcrumbs,
  };
}
