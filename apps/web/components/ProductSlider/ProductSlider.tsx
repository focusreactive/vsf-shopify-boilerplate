import React from 'react';
import { SfScrollable } from '@storefront-ui/react';
import { ProductCard } from '~/components';
import type { ProductSliderProps } from '~/components';
import { sdk } from '~/sdk';
import { Product } from '~/sdk/shopify/types';

const useProducts = (): { products: Product[] } => {
  const [products, setProducts] = React.useState<Product[]>([]);

  const getData = async () => {
    const resp = await sdk.shopify.getProducts({});
    setProducts(resp.products as unknown as Product[]);
  };

  React.useEffect(() => {
    getData();
  }, []);

  return { products };
};

export function ProductSlider({ className, ...attributes }: ProductSliderProps) {
  const { products } = useProducts();

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
