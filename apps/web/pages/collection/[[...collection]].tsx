import { useState, useEffect } from 'react';
import { GetServerSidePropsContext } from 'next';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ParsedUrlQuery } from 'node:querystring';
import {
  CategoryPageContent,
  CategoryTree,
  CategorySorting,
  CategoryFilters,
  Breadcrumb,
  Facet,
  FacetType,
} from '~/components';
import { fetchProducts, useProducts } from '~/hooks';
import { fetchCollections, useCollections } from '~/hooks/useCollections';
import { DefaultLayout } from '~/layouts';
import { Product } from '~/sdk/shopify/types';

interface ProductPageQuery extends ParsedUrlQuery {
  collection?: string[];
}

type CollectionPageProps = {
  collectionName?: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
const createFacets = (products: Product[]): Facet[] => {
  /**
   * Note: you can update this function logic to generate facets for your needs
   */
  const facetMap = new Map<string, Set<string>>();

  products.forEach((product) => {
    product.options.forEach((option) => {
      if (!facetMap.has(option.name)) {
        facetMap.set(option.name, new Set());
      }
      option.values.forEach((value) => facetMap.get(option.name)?.add(value));
    });
  });

  const facets: Facet[] = [...facetMap].map(([name, valuesSet]) => {
    let type: FacetType = FacetType.List; // Default type is 'list'
    if (name.toLowerCase() === 'color') {
      type = FacetType.Color;
    } else if (name.toLowerCase() === 'size') {
      type = FacetType.Chip;
    }

    return {
      name,
      label: name,
      values: [...valuesSet].map((value) => ({ label: value, value })),
      type,
    };
  });

  return facets;
};

export async function getServerSideProps({ res, params, locale }: GetServerSidePropsContext<ProductPageQuery>) {
  res.setHeader('Cache-Control', 'no-cache');

  const collection = (params?.collection && params?.collection[0]) || null;
  if (/^hidden-.*/.test(collection || '')) {
    return { notFound: true };
  }
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['products', collection || 'all'], () => fetchProducts(collection || ''));
  await queryClient.prefetchQuery(['collections'], () => fetchCollections());

  const data = queryClient.getQueryData(['products', collection || 'all']);

  if (!data) {
    return { notFound: true };
  }

  return {
    props: {
      key: 'cart',
      ...(await serverSideTranslations(locale as string, ['collection', 'common', 'footer', 'product'])),
      collectionName: collection,
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default function CollectionPage({ collectionName }: CollectionPageProps) {
  const { t } = useTranslation('collection');
  const { products, collection } = useProducts(collectionName);
  const { collections } = useCollections();

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  const handleFilterApply = (selectedFilters: { [key: string]: string[] }) => {
    /**
     * Note: you can write own logic of filtering products
     */
    const currentFilteredProducts = products.filter((product) =>
      product.variants.some((variant) =>
        Object.entries(selectedFilters).every(
          ([facetName, selectedValues]) =>
            selectedValues.length === 0 ||
            variant.selectedOptions.some(
              (option) => option.name === facetName && selectedValues.includes(option.value),
            ),
        ),
      ),
    );
    setFilteredProducts(currentFilteredProducts);
  };

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const collectionTitle = collection?.title || t('allProducts') || 'All Products';
  const collectionSlug = collection ? `/collection/${collection.slug}` : '/collection';
  const breadcrumbs: Breadcrumb[] = [
    { name: t('homePage'), link: '/' },
    { name: collectionTitle, link: collectionSlug },
  ];

  const collectionsMenu = collections.map((col) => ({ name: col.title, href: `/collection/${col.slug}` }));

  /**
   * Note: you can auto generate facets based on your product options
   * const facets = createFacets(products);
   * or you can edit the facets objects in the array below to specify you filters manually
   */
  const facets = [
    {
      label: 'Color',
      name: 'color',
      values: [
        { label: 'Crimson', value: '#DC143C' },
        { label: 'Steel Blue', value: '#4682B4' },
        { label: 'Forest Green', value: '#228B22' },
      ],
      type: 'color',
    },
    {
      label: 'Size',
      name: 'size',
      values: [
        { label: 'Small', value: 'S' },
        { label: 'Medium', value: 'M' },
        { label: 'Large', value: 'L' },
      ],
    },
    {
      label: 'Brand',
      name: 'brand',
      values: [
        { label: 'Brand A', value: 'brand-a' },
        { label: 'Brand B', value: 'brand-b' },
      ],
    },
    {
      label: 'Price Range',
      name: 'price',
      values: [
        { label: 'Under $50', value: 'under-50' },
        { label: '$50 to $100', value: '50-100' },
        { label: 'Over $100', value: 'over-100' },
      ],
      type: 'list',
    },
    {
      label: 'Material',
      name: 'material',
      values: [
        { label: 'Cotton', value: 'cotton' },
        { label: 'Polyester', value: 'polyester' },
        { label: 'Leather', value: 'leather' },
      ],
    },
  ] as Facet[];

  return (
    <DefaultLayout breadcrumbs={breadcrumbs}>
      <CategoryPageContent
        title={collectionTitle}
        products={filteredProducts}
        totalProducts={filteredProducts.length}
        sidebar={
          <>
            <CategoryTree parent={{ name: t('allProducts'), href: '/collection' }} collections={collectionsMenu} />
            <CategorySorting />
            <CategoryFilters facets={facets} onFilterApply={handleFilterApply} />
          </>
        }
      />
    </DefaultLayout>
  );
}
