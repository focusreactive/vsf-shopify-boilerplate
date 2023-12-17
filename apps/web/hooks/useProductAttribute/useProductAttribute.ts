import { useEffect } from 'react';
import { useCartContext } from '~/hooks/useCart';
import { Product } from '~/sdk/shopify/types';

interface AttributeValue {
  label: string;
  value: string;
}

interface UseProductAttribute {
  getAttributeList: (attributeName: string) => AttributeValue[];
  getAttribute: (attributeName: string) => string;
  setAttribute: (attributeName: string, value: string) => void;
  getOptions: () => string[];
}

export const useProductAttribute = (product: Product): UseProductAttribute => {
  const { setSelectedVariant, selectedVariantId } = useCartContext();

  useEffect(() => {
    const selectedVariant = product.variants.find((variant) => variant.id === selectedVariantId);
    if (selectedVariant) {
      const updatedAttributes = selectedVariant.selectedOptions.reduce((accumulator, option) => {
        accumulator[option.name] = option.value;
        return accumulator;
      }, {});
      setSelectedVariant(updatedAttributes);
    }
  }, [selectedVariantId, product.variants, setSelectedVariant]);

  const getAttributeList = (attributeName: string): AttributeValue[] => {
    const attribute = product.options.find((option) => option.name === attributeName);
    return attribute ? attribute.values.map((value) => ({ label: value, value })) : [];
  };

  const getAttribute = (attributeName: string): string => {
    const selectedVariant = product.variants.find((variant) => variant.id === selectedVariantId);
    const selectedOption = selectedVariant?.selectedOptions.find((option) => option.name === attributeName);
    return selectedOption?.value || '';
  };

  const setAttribute = (attributeName: string, value: string): void => {
    // Merging the new selection with the existing options
    const selectedOptions = {
      ...product.variants
        .find((variant) => variant.id === selectedVariantId)
        ?.selectedOptions.reduce((accumulator, option) => {
          accumulator[option.name] = option.value;
          return accumulator;
        }, {}),
      [attributeName]: value,
    };

    setSelectedVariant(selectedOptions);
  };

  const getOptions = (): string[] => {
    return product.options.map((option) => option.name);
  };

  return { getAttributeList, getAttribute, setAttribute, getOptions };
};
