import { BlockComponent } from '~/hooks';
import { getBlockComponent } from '../blocksConfig';
import { UnknownBlock } from './UnknownBlock';

type RenderContentProps = {
  contentBlock: BlockComponent;
};

export function RenderContent({ contentBlock, ...attributes }: RenderContentProps) {
  const BlockComponent = getBlockComponent(contentBlock) || UnknownBlock;
  return (
    <div>
      <BlockComponent {...contentBlock.fields} contentBlock={contentBlock} {...attributes} />
    </div>
  );
}
