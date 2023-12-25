import React from 'react';
import { convertSchemaToHtml } from '@thebeyondgroup/shopify-rich-text-renderer';
import { BlockComponent } from '~/hooks';
import withShopify from '~/sdk/shopify/withShopify';
import { Heading } from '../Heading';

type Props = {
  title: string;
  htmlString: string;
};

export const RichText = ({ title, htmlString }: Props) => {
  return (
    <>
      <Heading title={title} tag={'h2'} className="max-w-screen-3xl mx-auto px-4 md:px-10 mb-20" />;
      <div
        className="max-w-screen-3xl mx-auto px-4 md:px-10 mb-20"
        dangerouslySetInnerHTML={{
          __html: htmlString,
        }}
      />
    </>
  );
};

const wrapperFn = (block) => {
  const { title, description } = block.fields;
  let htmlString = '';
  try {
    htmlString = convertSchemaToHtml(JSON.parse(description));
  } catch (error) {
    console.error(error);
  }
  return {
    title,
    htmlString,
  };
};
export const RichTextBlock = withShopify({ wrapperFn, isDebug: false })(RichText);
