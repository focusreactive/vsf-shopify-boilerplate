import { useState } from 'react';
import { SfAttribute, SfProduct } from '@vue-storefront/unified-data-model';
import { get, map, defaults as withDefaults, zipObject, groupBy, uniqBy, pick, mapValues } from 'lodash-es';

/**
 * Hook for getting product attributes data
 * @param {SfProduct} product Product object
 */
export function useProductAttribute<TAttribute extends string>(product: SfProduct, attributesNames: TAttribute[] = []) {
  // const attributes = groupBy(
  //   uniqBy(
  //     (product?.variants || []).flatMap((variant) => variant?.attributes),
  //     'value',
  //   ),
  //   'name',
  // );
  // const mapAttribute = (attributes: SfAttribute[] = []) => {
  //   const mappedAttributes = mapValues(
  //     pick(groupBy(attributes, 'name'), attributesNames),
  //     (attribute) => attribute[0].value,
  //   );

  //   const defaults = zipObject(
  //     attributesNames,
  //     map(attributesNames, () => null),
  //   );
  //   return withDefaults(mappedAttributes, defaults);
  // };
  const defaultAttributes = Object.entries(product.attributes)
    .map(([name, values]) => ({ [name]: values[0].value }))
    .reduce((obj, attr) => ({ ...obj, ...attr }), {});

  const [selectedAttrs, setSelectedAttrs] = useState(defaultAttributes);

  return {
    getAttributeList: (attributeName: TAttribute) => get(product.attributes, attributeName, [] as SfAttribute[]),
    getAttribute: (attributeName: TAttribute) => get(selectedAttrs, attributeName, null),
    setAttribute: (attributeName: TAttribute, attributeValue: string) => {
      setSelectedAttrs((previous) => ({
        ...previous,
        [attributeName]: attributeValue,
      }));
    },
  };
}
