import { Fragment, ReactElement } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { RenderContent } from '~/components';
import { fetchPage, processContent, ContentComponent } from '~/hooks';
import { PageData, ContentReferences, Metaobject, ContentResponse } from '~/hooks/useContent/types';
import { DefaultLayout } from '~/layouts';

function flattenEdges({ edges }: ContentReferences): Metaobject[] {
  if (!edges || !Array.isArray(edges)) {
    return [];
  }

  return edges.map((edge) => edge.node);
}

export const getStaticProps: GetStaticProps = async ({
  locale,
}): Promise<
  { props: { pageData: PageData; content: ContentComponent[] }; revalidate: number } | { notFound: true }
> => {
  const slug = 'home-page';

  const pageData: PageData = await fetchPage(slug as string);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const rawContent: ContentResponse = flattenEdges(pageData?.content.references);
  const content = processContent(rawContent);

  if (!pageData) {
    return { notFound: true };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale as string, ['common', 'footer'])),
      pageData,
      content,
    },
    revalidate: 60,
  };
};

type LandingPageProps = {
  pageData: PageData;
  content: ContentComponent[];
};

const LandingPage = ({ pageData, content }: LandingPageProps): ReactElement => {
  return (
    <DefaultLayout seo={pageData.seo}>
      {content && (
        <div className="cms-content">
          {content.map((contentBlock) => (
            <Fragment key={contentBlock.id}>
              <RenderContent contentBlock={contentBlock} />
            </Fragment>
          ))}
        </div>
      )}
    </DefaultLayout>
  );
};

export default LandingPage;
