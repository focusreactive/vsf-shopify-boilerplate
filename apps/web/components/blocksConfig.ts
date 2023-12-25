import { DisplayBlock, CategoryCardBlock, HeroBlock, ProductSliderBlock } from '~/components';
import { BlockComponent } from '~/hooks';
import { RichTextBlock } from './RichText';

const contentMap = {
  display: () => DisplayBlock,
  collection_card: () => CategoryCardBlock,
  hero: () => HeroBlock,
  // richtext_block: () => RichTextBlock,
  // product_slider: () => ProductSliderBlock,
};

type ContentMapKey = keyof typeof contentMap;

export const getBlockComponent = (contentBlock: BlockComponent) => {
  const getComponent = contentMap[contentBlock.contentType as ContentMapKey];
  if (!getComponent) {
    return;
  }
  return getComponent();
};
