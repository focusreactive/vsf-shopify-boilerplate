import React from 'react';
import { SfScrollable } from '@storefront-ui/react';
import { Heading, ProductCard } from '~/components';
import type { ProductSliderProps } from '~/components';
import { useProducts } from '~/hooks';
import withShopify, { ShopifyBlock } from '~/sdk/shopify/withShopify';

export function ProductSlider({ className, title, collection, ...attributes }: ProductSliderProps) {
  const { products } = useProducts(collection);

  return (
    <>
      <Heading
        title={title}
        tag={'h2'}
        className="text-center mb-6 font-bold typography-headline-3 md:typography-headline-2"
      />
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
    </>
  );
}

type ProductSliderBlock = {
  collection: {
    __typename: 'Collection';
    id: string;
    title: string;
    slug: string;
    image: {
      url: string;
    };
  };
  title: string;
};

type ProductSliderBlockFields = {
  collection: ProductSliderBlock['collection'];
  title: string;
};

const wrapper = (contentBlock: ShopifyBlock<ProductSliderBlockFields>): ProductSliderProps => {
  return {
    collection: contentBlock.fields.collection.slug,
    title: contentBlock.fields.title,
  };
};

export const ProductSliderBlock = withShopify({ wrapperFn: wrapper, isDebug: false })((props: ProductSliderProps) => (
  <ProductSlider {...props} className="max-w-screen-3xl mx-auto px-4 md:px-10 mb-20" />
));
