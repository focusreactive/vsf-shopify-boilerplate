import { GetServerSidePropsContext } from 'next';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ParsedUrlQuery } from 'node:querystring';
import { CategoryPageContent, CategoryTree, CategorySorting, CategoryFilters, Breadcrumb } from '~/components';
import { fetchProducts, useProducts } from '~/hooks';
import { fetchCollections, useCollections } from '~/hooks/useCollections';
import { DefaultLayout } from '~/layouts';

interface ProductPageQuery extends ParsedUrlQuery {
  collection?: string[];
}

type CollectionPageProps = {
  collectionName?: string;
};

export async function getServerSideProps({ res, params, locale }: GetServerSidePropsContext<ProductPageQuery>) {
  res.setHeader('Cache-Control', 'no-cache');

  const collection = (params?.collection && params?.collection[0]) || null;
  if (/^hidden-.*/.test(collection || '')) {
    return {
      notFound: true,
    };
  }
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['products', collection || 'all'], () => fetchProducts(collection || ''));
  await queryClient.prefetchQuery(['collections'], () => fetchCollections());

  const data = queryClient.getQueryData(['products', collection || 'all']);

  if (!data) {
    return {
      notFound: true,
    };
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

  const collectionTitle = collection?.title || t('allProducts') || 'All Products';
  const collectionSlug = collection ? `/collection/${collection.slug}` : '/collection';
  const breadcrumbs: Breadcrumb[] = [
    { name: t('homePage'), link: '/' },
    { name: collectionTitle, link: collectionSlug },
  ];

  if (!products) {
    return null;
  }

  const collectionsMenu = collections.map((col) => ({ name: col.title, href: `/collection/${col.slug}` }));

  const facets = [
    {
      label: 'Color',
      name: 'color',
      values: [
        { label: 'Red', value: 'red' },
        { label: 'Blue', value: 'blue' },
        { label: 'Green', value: 'green' },
      ],
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
  ];

  return (
    <DefaultLayout breadcrumbs={breadcrumbs}>
      <CategoryPageContent
        title={collectionTitle}
        products={products}
        totalProducts={products.length}
        sidebar={
          <>
            <CategoryTree parent={{ name: t('allProducts'), href: '/collection' }} collections={collectionsMenu} />
            <CategorySorting />
            <CategoryFilters facets={facets} />
          </>
        }
      />
    </DefaultLayout>
  );
}
