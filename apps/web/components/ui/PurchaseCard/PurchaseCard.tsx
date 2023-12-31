import { useCounter } from 'react-use';
import {
  SfRating,
  SfButton,
  SfLink,
  SfCounter,
  SfIconShoppingCart,
  SfIconCompareArrows,
  SfIconFavorite,
  SfIconSell,
  SfIconPackage,
  SfIconWarehouse,
  SfIconSafetyCheck,
  SfIconShoppingCartCheckout,
} from '@storefront-ui/react';
import { clamp } from '@storefront-ui/shared';
import { Trans, useTranslation } from 'next-i18next';
import { QuantitySelector, Tag } from '~/components';
import type { PurchaseCardProps } from '~/components';
import { useCartContext } from '~/hooks';
import { CartLine } from '~/sdk/shopify/types';

function calcAddedProducts(productId: string, lines?: CartLine[]): number {
  if (!lines || lines.length === 0) {
    return 0;
  }
  return lines
    .filter(({ merchandise: { product } }) => product.id === productId)
    .map(({ quantity }) => quantity)
    .reduce((s, x) => s + x, 0);
}

export function PurchaseCard({ product, ...attributes }: PurchaseCardProps) {
  const { t } = useTranslation(['product', 'common']);
  const { addSelectedVariantToCart, selectedVariantId, cart } = useCartContext();
  const minProductQuantity = 1;
  const maxProductQuantity = 999;
  const [productQuantity, { set }] = useCounter(minProductQuantity);

  const selectedVariant = product.variants.find(({ id }) => id === selectedVariantId);

  function handleOnChange(nextValue: number) {
    set(clamp(nextValue, minProductQuantity, maxProductQuantity));
  }

  function handleAddToCart() {
    addSelectedVariantToCart(productQuantity);
  }

  const productsInCart = calcAddedProducts(product.id, cart?.lines);

  const rating = {
    // Note: implement you rating logic
    average: 4.5,
    count: 25,
  };

  return (
    <div
      className="p-4 xl:p-6 md:border md:border-neutral-100 md:shadow-lg md:rounded-md md:sticky md:top-20"
      data-testid="purchase-card"
      {...attributes}
    >
      {selectedVariant?.compareAtPrice ? (
        <Tag variant="secondary" strong className="mb-4">
          <SfIconSell size="sm" className="ml-1" />
          <span className="mr-1">{t('sale')}</span>
        </Tag>
      ) : null}
      <h1 className="mb-1 font-bold typography-headline-4" data-testid="product-name">
        {product.title}
      </h1>
      <div className="my-1">
        <span className="mr-2 text-secondary-700 font-bold font-headings text-2xl" data-testid="price">
          ${selectedVariant?.price?.amount}
        </span>
        {selectedVariant?.compareAtPrice ? (
          <span className="text-base font-normal text-neutral-500 line-through">
            ${selectedVariant?.compareAtPrice?.amount}
          </span>
        ) : null}
      </div>
      <div className="inline-flex items-center mt-4 mb-2">
        <SfRating size="xs" value={rating?.average} max={5} />
        <SfCounter className="ml-1" size="xs">
          {rating?.count}
        </SfCounter>
        <SfLink href="#" variant="secondary" className="ml-2 text-xs text-neutral-500">
          {t('reviewsCount', { count: rating?.count })}
        </SfLink>
      </div>
      <p className="mb-4 font-normal typography-text-sm" data-testid="product-description">
        {product.description}
      </p>
      <div className="py-4 mb-4 border-gray-200 border-y">
        <Tag className="w-full mb-4">
          <SfIconShoppingCartCheckout />
          {t('common:numberInCart', { count: productsInCart })}
        </Tag>
        <div className="flex flex-col md:flex-row flex-wrap gap-4">
          <QuantitySelector
            className="h-12  min-w-[145px] flex-grow flex-shrink-0 basis-0"
            value={productQuantity}
            minValue={minProductQuantity}
            maxValue={maxProductQuantity}
            onChange={handleOnChange}
          ></QuantitySelector>
          <SfButton
            type="button"
            size="lg"
            className="flex-grow-[2] flex-shrink basis-auto whitespace-nowrap"
            slotPrefix={<SfIconShoppingCart size="sm" />}
            onClick={handleAddToCart}
          >
            {t('common:addToCart')}
          </SfButton>
        </div>
        <div className="flex justify-center mt-4 gap-x-4">
          <SfButton type="button" size="sm" variant="tertiary" slotPrefix={<SfIconCompareArrows size="sm" />}>
            {t('common:compare')}
          </SfButton>
          <SfButton type="button" size="sm" variant="tertiary" slotPrefix={<SfIconFavorite size="sm" />}>
            {t('common:addToList')}
          </SfButton>
        </div>
      </div>
      <div className="flex first:mt-4">
        <SfIconPackage size="sm" className="flex-shrink-0 mr-1 text-neutral-500" />
        <p className="text-sm">
          <Trans ns="product" i18nKey="additionalInfo.shipping">
            Free shipping, arrives by Thu, Apr 7. Want it faster?&nbsp;
            <SfLink href="#" variant="secondary">
              Add an address
            </SfLink>
            &nbsp;to see options
          </Trans>
        </p>
      </div>
      <div className="flex mt-4">
        <SfIconWarehouse size="sm" className="flex-shrink-0 mr-1 text-neutral-500" />
        <p className="text-sm">
          <Trans ns="product" i18nKey="additionalInfo.pickup">
            Pickup not available at Super center.&nbsp;
            <SfLink href="#" variant="secondary">
              Check availability nearby
            </SfLink>
          </Trans>
        </p>
      </div>
      <div className="flex mt-4">
        <SfIconSafetyCheck size="sm" className="flex-shrink-0 mr-1 text-neutral-500" />
        <p className="text-sm">
          <Trans ns="product" i18nKey="additionalInfo.returns">
            Free 30-Day returns.&nbsp;
            <SfLink href="#" variant="secondary">
              Details
            </SfLink>
          </Trans>
        </p>
      </div>
    </div>
  );
}
