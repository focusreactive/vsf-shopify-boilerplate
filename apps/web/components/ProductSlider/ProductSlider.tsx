import React from 'react';
import { SfScrollable } from '@storefront-ui/react';
import { ProductCard } from '~/components';
import type { ProductSliderProps } from '~/components';
import { useProducts } from '~/hooks';
import withShopify from '~/sdk/shopify/withShopify';

export function ProductSlider({ className, collection, ...attributes }: ProductSliderProps) {
  const { products } = useProducts(collection);

  return (
    <SfScrollable
      buttonsPlacement="floating"
      className="items-center pb-4"
      {...attributes}
      wrapperClassName={className}
    >
      {products.map((product) => {
        const { id, title, description, priceRange, primaryImage, slug, variants } = product;
        return (
          <ProductCard
            key={id}
            className="w-[192px]"
            descriptionClassName="h-[192px]"
            name={title}
            description={description}
            compareAtPrice={variants[0]?.compareAtPrice?.amount}
            price={priceRange.minVariantPrice.amount}
            currencyCode={priceRange.minVariantPrice.currencyCode}
            imageUrl={primaryImage?.url}
            imageAlt={primaryImage?.altText}
            slug={slug}
            product={product}
          />
        );
      })}
    </SfScrollable>
  );
}

export const ProductSliderBlock = withShopify({ wrapperFn: (v) => v, isDebug: true })(ProductSlider);
