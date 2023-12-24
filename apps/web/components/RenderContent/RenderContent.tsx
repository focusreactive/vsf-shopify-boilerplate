import { Fragment, ReactElement } from 'react';
import { Page, Hero, Display, Heading, CategoryCard, ProductSlider } from '~/components';
import { BlockComponent, ContentComponent, GeneralContentBlock } from '~/hooks';

type UnknownBlockProps = {
  contentBlock: BlockComponent;
};

export const UnknownBlock = ({ contentBlock }: UnknownBlockProps) => {
  return (
    <div>
      <h3>Unknown Content Block</h3>
      <p>Type: {contentBlock.contentType}</p>
      <p>ID: {contentBlock.id}</p>
      {/* <pre>{JSON.stringify(contentBlock.fields, null, 2)}</pre> */}
      <hr />
    </div>
  );
};

const contentMap = {
  // display: Display,
  // collection_card: CategoryCard,
  // hero: Hero,
  // richtext_block: () => 'Rich Text',
  // product_slider: ProductSlider,
  unknown: UnknownBlock,
};

type ContentMapKey = keyof typeof contentMap;

const getBlockComponent = (contentBlock: BlockComponent) => {
  const Component = contentMap[contentBlock.contentType as ContentMapKey];
  return Component || contentMap.unknown;
};

type RenderContentProps = {
  contentBlock: BlockComponent;
};

export function RenderContent({ contentBlock, ...attributes }: RenderContentProps) {
  const BlockComponent = getBlockComponent(contentBlock);
  return (
    <div>
      <BlockComponent {...contentBlock.fields} contentBlock={contentBlock} />
    </div>
  );
}
