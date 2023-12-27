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
      {/*  eslint-disable-next-line @typescript-eslint/ban-ts-comment  */}
      {/* @ts-ignore */}
      <BlockComponent {...contentBlock.fields} contentBlock={contentBlock} {...attributes} />
    </div>
  );
}
