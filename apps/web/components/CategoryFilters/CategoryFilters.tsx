import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Filter } from './Filter';
import { CategoryFiltersProps } from './types';

export function CategoryFilters({ facets, onFilterApply }: CategoryFiltersProps) {
  const { t } = useTranslation('category');
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({});

  const handleFilterSelection = (facetName: string, selectedValue: string) => {
    const updatedFilters = { ...selectedFilters };
    if (!updatedFilters[facetName]) {
      updatedFilters[facetName] = [];
    }

    const currentIndex = updatedFilters[facetName].indexOf(selectedValue);
    if (currentIndex === -1) {
      updatedFilters[facetName].push(selectedValue);
    } else {
      updatedFilters[facetName].splice(currentIndex, 1);
    }

    setSelectedFilters(updatedFilters);
    onFilterApply(updatedFilters);
  };

  return (
    <>
      <span
        className="block py-2 px-4 mt-6 mb-4 bg-neutral-100 typography-headline-6 font-bold text-neutral-900 uppercase tracking-widest md:rounded-md"
        data-testid="category-filters"
      >
        {t('filters')}
      </span>
      <div className="flex flex-col gap-2">
        {facets.map((facet) => (
          <Filter
            key={facet.name}
            facet={facet}
            onChange={handleFilterSelection}
            selected={selectedFilters[facet.name] || []}
          />
        ))}
      </div>
    </>
  );
}
