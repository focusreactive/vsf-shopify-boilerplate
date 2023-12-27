import { SfAccordionItem, SfCheckbox, SfChip, SfListItem, SfThumbnail, useDisclosure } from '@storefront-ui/react';
import { useTranslation } from 'next-i18next';
import { FacetComponentProps, FilterProps } from './types';

const ColorFacet = ({ facetName, value, selected, onChange }: FacetComponentProps) => (
  <SfListItem
    key={value.value}
    as="label"
    selected={selected.includes(value.value)}
    onClick={() => onChange(facetName, value.value)}
    slotPrefix={<SfThumbnail size="sm" style={{ backgroundColor: value.value }} />}
  >
    {value.label}
  </SfListItem>
);

const ListFacet = ({ facetName, value, selected, onChange }: FacetComponentProps) => (
  <SfListItem
    key={value.value}
    as="label"
    slotPrefix={
      <SfCheckbox
        className="mt-2"
        value={value.value}
        checked={selected.includes(value.value)}
        onChange={() => onChange(facetName, value.value)}
      />
    }
  >
    {value.label}
  </SfListItem>
);

const ChipFacet = ({ facetName, value, selected, onChange }: FacetComponentProps) => (
  <SfChip
    key={value.value}
    inputProps={{ checked: selected.includes(value.value), onChange: () => onChange(facetName, value.value) }}
  >
    {value.label}
  </SfChip>
);

export function Filter({ facet: { name, label, values, type }, selected, onChange }: FilterProps) {
  const { t } = useTranslation();
  const { isOpen, toggle: toggleOpen } = useDisclosure({ initialValue: true });

  const handleSelectionChange = (facetName: string, value: string) => {
    onChange(facetName, value);
  };

  const facetComponents: { [key: string]: React.FC<FacetComponentProps> } = {
    color: ColorFacet,
    list: ListFacet,
    chip: ChipFacet,
  };

  const FacetComponent = facetComponents[type] || facetComponents.chip;

  return (
    <SfAccordionItem
      summary={
        <div className="flex justify-between p-2 mb-2">
          <p className="mb-2 font-medium typography-headline-5">{t(label)}</p>
        </div>
      }
      open={isOpen}
      onToggle={toggleOpen}
    >
      <div className="flex flex-wrap gap-4 px-1.5">
        {values.map((value) => (
          <FacetComponent
            key={value.value}
            facetName={name}
            value={value}
            selected={selected}
            onChange={handleSelectionChange}
          />
        ))}
      </div>
    </SfAccordionItem>
  );
}
