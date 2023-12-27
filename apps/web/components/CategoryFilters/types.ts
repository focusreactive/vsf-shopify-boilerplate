export enum FacetType {
  Color = 'color',
  List = 'list',
  Chip = 'chip',
}

export type FacetValue = {
  value: string;
  label: string;
};

export type Facet = {
  name: string;
  label: string;
  values: FacetValue[];
  type: FacetType;
};

export type FilterProps = {
  facet: Facet;
  selected: string[];
  onChange: (facetName: string, value: string) => void;
};

export type FacetComponentProps = {
  facetName: string;
  value: FacetValue;
  selected: string[];
  onChange: (facetName: string, value: string) => void;
};

export type CategoryFiltersProps = {
  facets: Facet[];
  onFilterApply: (selectedFilters: { [key: string]: string[] }) => void;
};
