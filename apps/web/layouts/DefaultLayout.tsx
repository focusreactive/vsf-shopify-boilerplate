import type { PropsWithChildren } from 'react';
import Link from 'next/link';
import { SfButton, SfIconExpandMore, SfIconShoppingCart } from '@storefront-ui/react';
import { useTranslation } from 'next-i18next';
import {
  Badge,
  Footer,
  BottomNav,
  ScrollToTopButton,
  NavbarTop,
  Search,
  Breadcrumb,
  NarrowContainer,
  Breadcrumbs,
} from '~/components';
import { CartProvider, useCartContext } from '~/hooks';
import { Product } from '~/sdk/shopify/types';

type LayoutPropsType = PropsWithChildren & {
  breadcrumbs?: Breadcrumb[];
  product?: Product;
};

const CartButton = () => {
  const { totalItems } = useCartContext();
  const { t } = useTranslation();

  return (
    <SfButton
      className="mr-2 -ml-0.5 text-white bg-primary-700 hover:bg-primary-800 hover:text-white active:bg-primary-900 active:text-white"
      as={Link}
      href="/cart"
      aria-label={t('numberInCart', totalItems)}
      variant="tertiary"
      square
      slotPrefix={
        <Badge bordered value={totalItems.count} className="text-neutral-900 bg-white">
          <SfIconShoppingCart />
        </Badge>
      }
    />
  );
};

export function DefaultLayout({ children, breadcrumbs = [], product }: LayoutPropsType): JSX.Element {
  const { t } = useTranslation();

  return (
    <CartProvider product={product}>
      <NavbarTop filled>
        <SfButton
          className="!px-2 mr-auto text-white bg-transparent hover:bg-primary-800 hover:text-white active:bg-primary-900 active:text-white font-body hidden md:inline-flex"
          as={Link}
          href="/collection"
          slotSuffix={<SfIconExpandMore />}
          variant="tertiary"
        >
          <span>{t('allProductsLinkText')}</span>
        </SfButton>
        <Search className="hidden md:block flex-1" />
        <nav className="hidden md:flex md:flex-row md:flex-nowrap">
          <CartButton />
        </nav>
      </NavbarTop>
      {breadcrumbs?.length > 0 && (
        <NarrowContainer>
          <div className="p-4 md:px-0">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
        </NarrowContainer>
      )}
      <main>{children}</main>
      <BottomNav />
      <ScrollToTopButton />
      <Footer className="mb-[58px] md:mb-0" />
    </CartProvider>
  );
}

DefaultLayout.defaultProps = {
  breadcrumbs: [],
};
