import { useMemo } from 'react';
import { SfProduct } from '@vue-storefront/unified-data-model';
import { useTranslation } from 'next-i18next';
import type { Breadcrumb } from '~/components';

/**
 * Hook for retrieving breadcrumbs.
 */
export function useProductBreadcrumbs(product?: SfProduct) {
  const { t } = useTranslation();
  const breadcrumbs = useMemo<Breadcrumb[]>(() => {
    if (!product) {
      return [];
    }

    return [
      { name: t('home'), link: '/' },
      product.productType && { name: product.productType, link: product.productType },
      { name: product.title as string, link: `#` },
    ].filter(Boolean);
  }, [product, t]);

  return {
    breadcrumbs,
  };
}
