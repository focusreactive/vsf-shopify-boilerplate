import { BlockComponent } from '~/hooks';

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
