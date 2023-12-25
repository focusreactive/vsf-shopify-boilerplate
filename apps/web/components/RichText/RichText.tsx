import React from 'react';
import { BlockComponent } from '~/hooks';
import withShopify from '~/sdk/shopify/withShopify';

type Props = {
  contentBlock: BlockComponent;
};

export const RichText = ({ contentBlock }: Props) => {
  return (
    <div>
      <h3>Rich Text Block</h3>
      <p>Type: {contentBlock.contentType}</p>
      <p>ID: {contentBlock.id}</p>
      {/* <pre>{JSON.stringify(contentBlock.fields, null, 2)}</pre> */}
      <hr />
    </div>
  );
};

export const RichTextBlock = withShopify({ wrapperFn: (v) => v, isDebug: true })(RichText);
