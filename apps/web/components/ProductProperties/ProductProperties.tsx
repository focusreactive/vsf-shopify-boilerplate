import { SfChip, SfThumbnail } from '@storefront-ui/react';
import { useTranslation } from 'next-i18next';
import { Divider, type ProductPropertiesProps } from '~/components';
import { useProductAttribute } from '~/hooks';

export function ProductProperties({
  product,
  showColors = true,
  ...attributes
}: ProductPropertiesProps): JSX.Element | null {
  const { t } = useTranslation();

  const { getOptions, getAttributeList, getAttribute, setAttribute } = useProductAttribute(product);
  const options = getOptions();

  if (options.length === 0) {
    return null;
  }

  return (
    <>
      <Divider className="mb-6" />
      <div className="px-4" {...attributes}>
        {options.map((option) => {
          const optionValues = getAttributeList(option);
          const selectedValue = getAttribute(option);

          return (
            optionValues.length > 1 && (
              <div key={option}>
                <span className="block mb-2 mt-2 text-base font-medium leading-6 text-neutral-900">
                  {t(option.toLowerCase())}
                </span>
                {optionValues.map(({ label, value }) => (
                  <div className="mr-2 mb-2 uppercase inline-block" key={value}>
                    <SfChip
                      className="min-w-[48px]"
                      size="sm"
                      slotPrefix={
                        option === 'Color' && showColors ? (
                          <SfThumbnail size="sm" style={{ background: value }} />
                        ) : null
                      }
                      inputProps={{
                        checked: value === selectedValue,
                        onChange: () => setAttribute(option, value),
                      }}
                    >
                      {label}
                    </SfChip>
                  </div>
                ))}
              </div>
            )
          );
        })}
      </div>
      <Divider className="mt-4 mb-2 md:mt-8" />
    </>
  );
}
