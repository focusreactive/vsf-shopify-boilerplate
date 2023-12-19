import Image from 'next/image';
import Link from 'next/link';
import { SfButton, SfRating, SfCounter, SfLink, SfIconShoppingCart } from '@storefront-ui/react';
import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import type { ProductCardProps } from '~/components';
import useProductRating from '~/hooks/useProductRating/useProductRating';

export function ProductCard({
  name,
  description,
  imageUrl,
  imageAlt,
  price,
  compareAtPrice,
  currencyCode,
  slug,
  className,
  descriptionClassName,
  priority,
  product,
  ...attributes
}: ProductCardProps) {
  const { t } = useTranslation();
  const { rating, ratingCount } = useProductRating(product);

  // TODO [>0.2] Care about getting right locale for price formatting
  const priceString = price
    ? new Intl.NumberFormat('en-EN', { style: 'currency', currency: currencyCode }).format(price)
    : '';
  const compareString = compareAtPrice
    ? new Intl.NumberFormat('en-EN', { style: 'currency', currency: currencyCode }).format(compareAtPrice)
    : '';

  return (
    <div
      className={classNames(
        'border border-neutral-200 rounded-md hover:shadow-lg flex-auto flex-shrink-0 flex flex-col justify-between',
        className,
      )}
      data-testid="product-card"
      {...attributes}
    >
      <div className="relative">
        <SfLink href={`/product/${slug}`} as={Link} className="relative block w-full pb-[100%]">
          {imageUrl && (
            <Image
              src={imageUrl ?? ''}
              alt={imageAlt || 'primary image'}
              className="object-cover rounded-md aspect-square w-full h-full"
              data-testid="image-slot"
              fill
              sizes="(max-width: 768px) 50vw, 190px"
              priority={priority}
            />
          )}
        </SfLink>
      </div>
      <div
        className={classNames(
          'p-2 border-t border-neutral-200 typography-text-sm flex flex-col justify-between items-start',
          descriptionClassName,
        )}
      >
        <SfLink href={`/product/${slug}`} as={Link} variant="secondary" className="no-underline">
          {name}
        </SfLink>
        {rating && ratingCount ? (
          <div className="flex items-center pt-1">
            <SfRating size="xs" value={rating} max={5} />

            <SfLink href="#" variant="secondary" as={Link} className="ml-1 no-underline">
              <SfCounter size="xs">{ratingCount}</SfCounter>
            </SfLink>
          </div>
        ) : null}
        <div className="block py-2 font-normal typography-text-xs text-neutral-700 text-justify flex-grow flex-shrink overflow-hidden">
          <p>{description}</p>
        </div>
        <div>
          {compareAtPrice ? (
            <p className="pb-2">
              <span className="font-bold typography-text-sm" data-testid="product-card-vertical-price">
                {priceString}
              </span>
              <span
                className="ml-3 font-normal line-through typography-text-sm "
                data-testid="product-card-vertical-price"
              >
                {compareString}
              </span>
            </p>
          ) : (
            <span className="block pb-2 font-bold typography-text-sm" data-testid="product-card-vertical-price">
              {priceString}
            </span>
          )}
          <SfButton type="button" size="sm" slotPrefix={<SfIconShoppingCart size="sm" />}>
            {t('addToCartShort')}
          </SfButton>
        </div>
      </div>
    </div>
  );
}
