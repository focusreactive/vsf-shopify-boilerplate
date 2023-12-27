import React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { convertSchemaToHtml } from '@thebeyondgroup/shopify-rich-text-renderer';
import withShopify, { ShopifyBlock } from '~/sdk/shopify/withShopify';
import { Heading } from '../Heading';

type Props = {
  title: string;
  htmlString: string;
};

export const RichText = ({ title, htmlString }: Props) => {
  return (
    <>
      <Heading
        title={title}
        tag={'h2'}
        className="text-center mb-6 font-bold typography-headline-3 md:typography-headline-2"
      />
      <div
        className="max-w-screen-3xl mx-auto px-4 md:px-10 mb-20"
        dangerouslySetInnerHTML={{
          __html: htmlString,
        }}
      />
    </>
  );
};

type RichTextFields = {
  title: string;
  description: string;
};

const wrapper = (block: ShopifyBlock<RichTextFields>) => {
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
export const RichTextBlock = withShopify({ wrapperFn: wrapper, isDebug: false })(RichText);
