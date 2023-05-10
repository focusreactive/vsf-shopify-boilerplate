import { GetServerSidePropsContext } from 'next';
import NextLink from 'next/link';
import { SfButton, SfLink } from '@storefront-ui/react';
import { Trans, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Divider, OrderSummary } from '~/components';
import CheckoutAddress from '~/components/CheckoutAddress';
import { CheckoutPayment } from '~/components/CheckoutPayment';
import ContactInformation from '~/components/ContactInformation';
import ShippingMethod from '~/components/ShippingMethod';
import { CheckoutLayout } from '~/layouts';

export async function getServerSideProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      key: 'checkout',
      ...(await serverSideTranslations(locale as string, [
        'cart',
        'checkout',
        'common',
        'footer',
        'address',
        'message',
      ])),
    },
  };
}

export default function Checkout() {
  const { t } = useTranslation('checkout');

  return (
    <CheckoutLayout backHref="/cart" backLabel={t('back')} heading={t('checkout')}>
      <div className="md:grid md:grid-cols-12 md:gap-x-6">
        <div className="col-span-7 mb-10 md:mb-0">
          <Divider className="w-screen md:w-auto -mx-4 md:mx-0" />
          <ContactInformation />
          <Divider className="w-screen md:w-auto -mx-4 md:mx-0" />

          <CheckoutAddress
            heading={t('address:billing.heading')}
            description={t('address:billing.description')}
            buttonText={t('address:billing.addButton')}
            type="billingAddress"
          />
          <Divider className="w-screen md:w-auto -mx-4 md:mx-0" />
          <CheckoutAddress
            heading={t('address:shipping.heading')}
            description={t('address:shipping.description')}
            buttonText={t('address:shipping.addButton')}
            type="shippingAddress"
          />
          <Divider className="w-screen md:w-auto -mx-4 md:mx-0" />
          <ShippingMethod />
          <Divider className="w-screen md:w-auto -mx-4 md:mx-0" />
          <CheckoutPayment activePayment="credit-card" onPaymentChange={() => {}} />
          <Divider className="w-screen md:w-auto -mx-4 md:mx-0 mb-10" />
        </div>
        <div className="col-span-5 md:p-4 xl:p-6 md:border md:border-neutral-100 md:shadow-lg md:rounded-md md:sticky md:top-20 h-fit">
          <OrderSummary>
            <>
              <SfButton as={NextLink} href="/" data-testid="placeOrder" size="lg" className="w-full mb-4 md:mb-0">
                {t('placeOrder')}
              </SfButton>
              <p className="text-sm text-center mt-4 pb-4 md:pb-0">
                <Trans ns="checkout" i18nKey="termsInfo">
                  By placing my order, you agree to our
                  <SfLink
                    as={NextLink}
                    href="#"
                    className="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
                  >
                    Terms and Conditions
                  </SfLink>
                  and our
                  <SfLink
                    as={NextLink}
                    href="#"
                    className="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
                  >
                    Privacy Policy
                  </SfLink>
                  .
                </Trans>
              </p>
            </>
          </OrderSummary>
        </div>
      </div>
    </CheckoutLayout>
  );
}