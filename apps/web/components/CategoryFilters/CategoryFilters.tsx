import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Filter } from './Filter';
import { CategoryFiltersProps } from './types';

export function CategoryFilters({ facets }: CategoryFiltersProps) {
  const { t } = useTranslation('category');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const colorFacets = facets.find(({ name }) => name === 'color');
  const sizeFacets = facets.find(({ name }) => name === 'size');

  const handleFilterSelection = (currentValue: string) => {
    if (selectedFilters.includes(currentValue)) {
      setSelectedFilters(selectedFilters.filter((value) => value !== currentValue));
    } else {
      setSelectedFilters([...selectedFilters, currentValue]);
    }
  };

  return (
    <>
      <h5 className="py-2 px-4 mt-6 mb-4 bg-neutral-100 typography-headline-6 font-bold text-neutral-900 uppercase tracking-widest md:rounded-md">
        {t('filters')}
      </h5>
      <div className="flex flex-col gap-2">
        {sizeFacets && (
          <Filter facet={sizeFacets} onChange={handleFilterSelection} selected={selectedFilters} type="size" />
        )}
        {colorFacets && (
          <Filter facet={colorFacets} onChange={handleFilterSelection} selected={selectedFilters} type="color" />
        )}
      </div>
    </>
  );
}