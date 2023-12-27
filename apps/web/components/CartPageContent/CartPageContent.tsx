import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SfButton, SfLoaderCircular } from '@storefront-ui/react';
import { useTranslation } from 'next-i18next';
import { OrderSummary, CartProductCard } from '~/components';
import { useCart } from '~/hooks';
import emptyCartImage from '~/public/images/empty-cart.svg';

const Loading = () => (
  <span className="!flex justify-center my-40 h-24">
    <SfLoaderCircular size="3xl" />
  </span>
);

interface EmptyProps {
  message: string;
  alt: string;
}

const Empty = ({ message, alt }: EmptyProps) => (
  <div className="flex items-center justify-center flex-col pt-24 pb-32" data-testid="cart-page-content">
    <Image src={emptyCartImage} alt={alt} />
    <h2 className="mt-8">{message}</h2>
  </div>
);

export function CartPageContent() {
  const { t } = useTranslation('cart');
  const { cart, changeCartItemQuantity, isLoading, removeCartItem, totalItems } = useCart();

  const handleChangeQuantity = (lineId: string, currentQuantity: number) => (quantity: number) => {
    if (isLoading) {
      return;
    }
    if (currentQuantity === quantity) {
      return;
    }
    changeCartItemQuantity(lineId, quantity);
  };

  const handleRemoveLine = (lineId: string) => () => {
    removeCartItem(lineId);
  };

  const placeHolder: ReactNode = isLoading ? (
    <Loading />
  ) : (
    <Empty message={t('emptyCart')} alt={t('emptyCartImgAlt')} />
  );

  return cart?.lines.length ? (
    <div className="md:grid md:grid-cols-12 md:gap-x-6" data-testid="cart-page-content">
      <div className="col-span-7 mb-10 md:mb-0">
        {cart.lines.map(({ id, merchandise, quantity }) => (
          <CartProductCard
            key={id}
            attributes={merchandise.selectedOptions}
            imageUrl={merchandise.image?.url}
            imageAlt={merchandise.image?.altText}
            name={merchandise.product.title}
            price={merchandise.price?.amount || 0}
            priceTotal={Math.round((merchandise.price?.amount || 0) * quantity * 100) / 100}
            specialPrice={merchandise.unitPrice?.amount || 0}
            maxValue={10}
            minValue={1}
            value={quantity}
            slug={merchandise.product.slug}
            onChangeQuantity={handleChangeQuantity(id, quantity)}
            onRemoveLine={handleRemoveLine(id)}
            isLoading={isLoading}
          />
        ))}
      </div>
      <OrderSummary cart={cart} totalItems={totalItems} className="col-span-5 md:sticky md:top-20 h-fit">
        <SfButton as={Link} href={cart.checkoutUrl} size="lg" className="w-full mb-4 md:mb-0">
          {t('goToCheckout')}
        </SfButton>
      </OrderSummary>
    </div>
  ) : (
    <>{placeHolder}</>
  );
}
