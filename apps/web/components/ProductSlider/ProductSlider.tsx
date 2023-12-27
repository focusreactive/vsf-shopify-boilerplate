import React from 'react';
import { SfScrollable } from '@storefront-ui/react';
import { ProductCard } from '~/components';
import type { ProductSliderProps } from '~/components';
import { sdk } from '~/sdk';

const processProducts = (resp) => {
  try {
    const productsResponse = resp.data.products.edges;
    return productsResponse.map(({ node }) => ({
      ...node,
      price: node.priceRange?.minVariantPrice?.amount,
      currencyCode: node.priceRange?.minVariantPrice?.currencyCode,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

const useProducts = () => {
  const [products, setProducts] = React.useState([]);

  const getData = async () => {
    const resp = await sdk.shopify.getProducts({});
    setProducts(resp.products);
  };

  React.useEffect(() => {
    getData();
  }, []);

  return { products };
};

export function ProductSlider({ className, ...attributes }: ProductSliderProps) {
  const { products } = useProducts();

  // return products.map((d) => <p>{JSON.stringify(d)}</p>);
  return (
    <SfScrollable
      buttonsPlacement="floating"
      className="items-center pb-4"
      {...attributes}
      wrapperClassName={className}
    >
      {products.map(({ id, title, description, rating, price, currencyCode, primaryImage, slug }) => (
        <ProductCard
          key={id}
          className="w-[192px]"
          descriptionClassName="h-[192px]"
          name={title}
          description={description}
          ratingCount={rating?.count}
          rating={rating?.average}
          price={price}
          currencyCode={currencyCode}
          imageUrl={primaryImage?.url}
          imageAlt={primaryImage?.altText}
          slug={slug}
        />
      ))}
    </SfScrollable>
  );
}
