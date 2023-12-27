import { SfChip, SfThumbnail } from '@storefront-ui/react';
import { useTranslation } from 'next-i18next';
import type { ProductPropertiesProps } from '~/components';
import { useProductAttribute } from '~/hooks';

export function ProductProperties({ product, showColors = true, ...attributes }: ProductPropertiesProps): JSX.Element {
  const { t } = useTranslation();

  const { getAttributeList, getAttribute, setAttribute } = useProductAttribute(product, ['Color', 'Size']);

  const sizes = getAttributeList('Size');
  const colors = getAttributeList('Color');
  const selectedSize = getAttribute('Size');
  const selectedColor = getAttribute('Color');

  return (
    <div className="px-4" {...attributes}>
      {sizes.length > 1 && (
        <>
          <span className="block mb-2 mt-2 text-base font-medium leading-6 text-neutral-900">{t('size')}</span>
          {sizes.map(({ label, value }) => (
            <div className="mr-2 mb-2 uppercase inline-block" key={value}>
              <SfChip
                className="min-w-[48px]"
                size="sm"
                inputProps={{
                  checked: value === selectedSize,
                  onChange: () => setAttribute('Size', value),
                }}
              >
                {label}
              </SfChip>
            </div>
          ))}
        </>
      )}
      {colors.length > 1 && (
        <>
          <span className="block mb-2 mt-2 text-base font-medium leading-6 text-neutral-900">{t('color')}</span>
          {colors.map(({ value, label }) => (
            <div key={value} className="mr-2 mb-2 inline-block">
              <SfChip
                slotPrefix={showColors ? <SfThumbnail size="sm" style={{ background: value }} /> : null}
                size="sm"
                inputProps={{
                  checked: value === selectedColor,
                  onChange: () => setAttribute('Color', value),
                }}
              >
                {label}
              </SfChip>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
