import React, { ComponentType, ForwardedRef } from 'react';

export type ShopifyBlock<FieldsType = object> = {
  contentType: string;
  id: string;
  fields: FieldsType;
};

type DebugBlockProps = {
  contentBlock: ShopifyBlock<unknown>;
  name: string;
};

export const DebugBlock = ({ contentBlock, name }: DebugBlockProps) => {
  const { fields, ...rest } = contentBlock;
  return (
    <div>
      <h2 className="text-lg">{name}</h2>
      <p>Type: {contentBlock.contentType}</p>
      <p>ID: {contentBlock.id}</p>
      <pre>{JSON.stringify(rest, null, 2)}</pre>
      <pre className="text-xs">{JSON.stringify(fields, null, 2)}</pre>
      <hr />
    </div>
  );
};

type WrapperFunction<FieldsType> = (props: ShopifyBlock<FieldsType>) => object;

interface WithShopifyOptions<FieldsType> {
  wrapperFn: WrapperFunction<FieldsType>;
  isDebug?: boolean;
}

const withShopify =
  <FieldsType,>({ wrapperFn, isDebug }: WithShopifyOptions<FieldsType>) =>
  <Props extends object>(WrappedComponent: ComponentType<Props>) => {
    const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

    const WithShopify = React.forwardRef<ForwardedRef<any>, { contentBlock: ShopifyBlock<FieldsType> }>(
      (props, reference) => {
        if (isDebug) {
          return <DebugBlock contentBlock={props.contentBlock} name={wrappedComponentName} />;
        }
        const baseProps = wrapperFn(props.contentBlock);
        return <WrappedComponent {...(baseProps as Props)} ref={reference} />;
      },
    );

    WithShopify.displayName = `withShopify(${wrappedComponentName})`;

    return WithShopify;
  };

export default withShopify;
