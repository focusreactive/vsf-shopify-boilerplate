import { useCallback, useEffect } from 'react';
import { useCartContext } from '~/hooks/useCart';
import { Product, Variant, Option } from '~/sdk/shopify/types';

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

  const getSelectedVariant = useCallback((): Variant | undefined => {
    return product.variants.find((variant: Variant) => variant.id === selectedVariantId);
  }, [product.variants, selectedVariantId]);

  const getAttributeList = (attributeName: string): AttributeValue[] => {
    const attribute = product.options.find((option: Option) => option.name === attributeName);
    return attribute ? attribute.values.map((value) => ({ label: value, value })) : [];
  };

  const getAttribute = (attributeName: string): string => {
    const selectedVariant = getSelectedVariant();
    const selectedOption = selectedVariant?.selectedOptions.find((option) => option.name === attributeName);
    return selectedOption?.value || '';
  };

  const setAttribute = (attributeName: string, value: string): void => {
    const selectedOptions = {
      ...getSelectedVariant()?.selectedOptions.reduce((accumulator: { [key: string]: string }, option) => {
        accumulator[option.name] = option.value;
        return accumulator;
      }, {}),
      [attributeName]: value,
    };

    setSelectedVariant(selectedOptions);
  };

  const getOptions = (): string[] => {
    return product.options.map((option: Option) => option.name);
  };

  useEffect(() => {
    const selectedVariant = getSelectedVariant();
    if (selectedVariant) {
      const updatedAttributes = selectedVariant.selectedOptions.reduce(
        (accumulator: { [key: string]: string }, option) => {
          accumulator[option.name] = option.value;
          return accumulator;
        },
        {},
      );
      setSelectedVariant(updatedAttributes);
    }
  }, [selectedVariantId, product.variants, setSelectedVariant, getSelectedVariant]);

  return { getAttributeList, getAttribute, setAttribute, getOptions };
};
