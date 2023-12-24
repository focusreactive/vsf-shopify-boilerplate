import { Fragment, ReactElement } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { RenderContent } from '~/components';
import { fetchPage, fetchAllPages, processContent } from '~/hooks';
import { PageData, ContentReferences, Metaobject } from '~/hooks/useContent/types';
import { DefaultLayout } from '~/layouts';

function flattenEdges({ edges }: ContentReferences): Metaobject[] {
  if (!edges || !Array.isArray(edges)) {
    return [];
  }

  return edges.map((edge) => edge.node);
}

export const getStaticPaths: GetStaticPaths = async (): Promise<{
  paths: { params: { landing: string } }[];
  fallback: boolean | 'blocking';
}> => {
  const allPages: string[] = await fetchAllPages();
  const paths = allPages.map((page) => ({ params: { landing: page } }));

  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({
  params,
  locale,
}): Promise<{ props: { pageData: PageData; content: Metaobject[] }; revalidate: number } | { notFound: true }> => {
  const slug = params?.landing;
  if (!slug) {
    return { notFound: true };
  }

  const pageData: PageData = await fetchPage(slug as string);
  const rawContent: Metaobject[] = flattenEdges(pageData?.content.references);
  const content = processContent(rawContent);
  // console.log("🚀 ~ file: [landing].tsx:39 ~ content:", content)

  if (!pageData) {
    return { notFound: true };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale as string, ['common', 'footer'])),
      pageData,
      content,
      rawContent,
    },
    revalidate: 60,
  };
};

type LandingPageProps = {
  pageData: PageData;
  content: Metaobject[];
};

const LandingPage: NextPage<{ pageData: PageData; content: Metaobject[]; rawContent: any[] }> = ({
  pageData,
  content,
  rawContent,
}: LandingPageProps): ReactElement => {
  console.log('🚀 ~ file: [landing].tsx:76 ~ content:', content);
  console.log('🚀 ~ file: [landing].tsx:80 ~ rawContent:', rawContent);
  return (
    <DefaultLayout seo={pageData.seo}>
      {content && false && (
        <div className="cms-content">
          {content.map(({ fields }, index) => (
            <Fragment key={`${fields.component}-${index}`}>
              <RenderContent content={fields.content} />
            </Fragment>
          ))}
        </div>
      )}
    </DefaultLayout>
  );
};

export default LandingPage;
