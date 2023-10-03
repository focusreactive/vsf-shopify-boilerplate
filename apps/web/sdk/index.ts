import { initSDK, buildModule } from '@vue-storefront/sdk';
import { type SdkModule, sdkModule } from '@vue-storefront/storefront-boilerplate-sdk';
// TODO [+@vue-storefront/shopify-sdk>=1]: outside of integration boilerplate it should be imported from NPM
import { shopifyModule, ShopifyModuleType } from '../../../../packages/sdk/src';
// import { type ShopifyModuleType, shopifyModule } from '@vue-storefront/shopify-sdk';
import { fragments } from './fragments';

const sdkConfig = {
  commerce: buildModule<SdkModule>(sdkModule),
  shopify: buildModule<ShopifyModuleType>(shopifyModule, {
    // TODO [>1] switch to secure URL
    // eslint-disable-next-line @microsoft/sdl/no-insecure-url
    apiUrl: 'http://0.0.0.0:8181/shopify',
    fragments,
  }),
};

export const sdk = initSDK<typeof sdkConfig>(sdkConfig);
