import React from 'react';
import { SfScrollable } from '@storefront-ui/react';
import { ProductCard } from '~/components';
import type { ProductSliderProps } from '~/components';
import { sdk } from '~/sdk';

const useProducts = () => {
  const [products, setProducts] = React.useState(null);

  const getData = async () => {
    const data = await sdk.shopify.getProducts();
    setProducts(data);
  };

  React.useEffect(() => {
    getData();
  }, []);

  return { products };
};

export function ProductSlider({ className, ...attributes }: ProductSliderProps) {
  const { products } = useProducts();

  return JSON.stringify(products);
  return (
    <SfScrollable
      buttonsPlacement="floating"
      className="items-center pb-4"
      {...attributes}
      wrapperClassName={className}
    >
      {products.map(({ id, name, description, rating, price, primaryImage, slug }) => (
        <ProductCard
          key={id}
          className="max-w-[192px]"
          name={name}
          description={description}
          ratingCount={rating?.count}
          rating={rating?.average}
          price={price?.value.amount}
          imageUrl={primaryImage?.url}
          imageAlt={primaryImage?.alt}
          slug={slug}
        />
      ))}
    </SfScrollable>
  );
}
