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
  CategoryTreeItem,
} from '~/components';
import { fetchProducts, useProducts } from '~/hooks';
import { DefaultLayout } from '~/layouts';

export async function prefetchProducts(collection?: string): Promise<QueryClient> {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['products', collection || 'all'], () => fetchProducts(collection));

  return queryClient;
}

interface ProductPageQuery extends ParsedUrlQuery {
  collection?: string[];
}

export async function getServerSideProps({ res, params }: GetServerSidePropsContext<ProductPageQuery>) {
  res.setHeader('Cache-Control', 'no-cache');

  const collection = (params?.collection && params?.collection[0]) || undefined;
  if (/^hidden-.*/.test(collection || '')) {
    return {
      notFound: true,
    };
  }
  // console.log("🚀 ~ file: [[...collection]].tsx:32 ~ getServerSideProps ~ collection:", collection)
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['products', collection || 'all'], () => fetchProducts(collection));
  const data = queryClient.getQueryData(['products', collection || 'all']);
  // console.log("🚀 ~ file: [[...collection]].tsx:36 ~ getServerSideProps ~ data:", data)

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      collection,
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default function CategoryPage({ collection }) {
  const { t } = useTranslation('category');
  const breadcrumbs: Breadcrumb[] = [
    { name: t('common:home'), link: '/' },
    { name: t('allProducts'), link: '/category' },
  ];
  const { products } = useProducts(collection);

  if (!products) {
    return null;
  }

  // const { products, pagination, subCategories, facets } = productsCatalog;
  // const categories: CategoryTreeItem[] = subCategories.map(({ name, productCount }) => ({
  //   name,
  //   count: productCount || 0,
  //   href: '/category',
  // }));

  return (
    <DefaultLayout breadcrumbs={breadcrumbs}>
      <CategoryPageContent
        title={t('allProducts')}
        products={products}
        totalProducts={products.length}
        sidebar={
          <>
            {/* <CategoryTree parent={{ name: t('allProducts'), href: '/category' }} categories={categories} /> */}
            <CategorySorting />
            {/* <CategoryFilters facets={facets} /> */}
          </>
        }
      />
    </DefaultLayout>
  );
}
