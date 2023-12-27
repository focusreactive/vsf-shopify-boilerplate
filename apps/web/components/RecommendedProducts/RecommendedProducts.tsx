import { useTranslation } from 'next-i18next';
import { ProductSlider } from '~/components/ProductSlider';

export function RecommendedProducts() {
  const { t } = useTranslation('product');

  return (
    <>
      <p data-testid="recommended-products" className="my-4 typography-text-lg font-body">
        {t('recommendedProducts')}
      </p>
      <ProductSlider title="Recommended Products" />
    </>
  );
}
