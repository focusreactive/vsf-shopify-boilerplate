import { useState } from 'react';
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

export const useProductAttribute = (product: Product, attributes: string[]): UseProductAttribute => {
  const initialAttributes = attributes.reduce<Record<string, string>>((accumulator, attribute) => {
    const option = product.options.find((opt) => opt.name === attribute);
    if (option && option.values.length > 0) {
      accumulator[attribute] = option.values[0];
    }
    return accumulator;
  }, {});

  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>(initialAttributes);

  const getAttributeList = (attributeName: string): AttributeValue[] => {
    const attribute = product.options.find((option) => option.name === attributeName);
    return attribute ? attribute.values.map((value) => ({ label: value, value })) : [];
  };

  const getAttribute = (attributeName: string): string => {
    return selectedAttributes[attributeName] || '';
  };

  const setAttribute = (attributeName: string, value: string): void => {
    setSelectedAttributes((previous) => ({ ...previous, [attributeName]: value }));
  };

  const getOptions = (): string[] => {
    return product.options.map((option) => option.name);
  };

  return { getAttributeList, getAttribute, setAttribute, getOptions };
};
