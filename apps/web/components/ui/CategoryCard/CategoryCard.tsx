import Image from 'next/image';
import Link from 'next/link';
import { Maybe } from '@vue-storefront/unified-data-model';
import type { CategoryCardProps } from '~/components';
import withShopify, { ShopifyBlock } from '~/sdk/shopify/withShopify';

export function CategoryCard({ items, ...attributes }: CategoryCardProps) {
  return (
    <div
      className="max-w-screen-3xl mx-auto md:px-10 px-4 mb-10 flex flex-nowrap md:flex-wrap md:justify-center overflow-x-scroll scrollbar-hidden"
      data-testid="category-card"
      {...attributes}
    >
      {items.map(({ name, image, slug }) => (
        <div className="mr-2 md:mr-6 group" key={name}>
          <Link
            className="w-full h-full z-1 focus-visible:outline focus-visible:outline-offset focus-visible:rounded-md"
            href={slug}
            aria-label={name}
          >
            <div className="relative h-[240px] w-[240px] rounded-full bg-neutral-100 group-hover:shadow-xl group-active:shadow-none">
              <Image src={image} alt={name} width={240} height={240} />
            </div>
            <div className="flex justify-center">
              <p className="mt-4 font-semibold no-underline text-normal-900 typography-text-base group-hover:underline group-hover:text-primary-800 group-hover:font-normal group-active:text-primary-800 group-active:font-normal">
                {name}
              </p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

type CollectionItem = {
  __typename: 'Collection';
  id: string;
  title: string;
  slug: string;
  image: Maybe<{ url: string }>;
};

type SpecificFieldsType = {
  collection_1: CollectionItem;
  collection_2: CollectionItem;
  collection_3: CollectionItem;
  title: string;
};

const wrapper = (contentBlock: ShopifyBlock<SpecificFieldsType>): CategoryCardProps => {
  const { collection_1, collection_2, collection_3 } = contentBlock.fields;

  // Construct items array
  const items: CategoryCardProps['items'] = [collection_1, collection_2, collection_3].map((collection) => {
    if (!collection || collection.__typename !== 'Collection') {
      throw new Error('Invalid collection item');
    }

    const image = collection.image?.url || '';

    return {
      id: collection.slug,
      name: collection.title,
      image,
      slug: `/collection/${collection.slug}`,
      subcategories: [],
      productCount: null,
    };
  });

  return { items };
};

export const CategoryCardBlock = withShopify<SpecificFieldsType>({ wrapperFn: wrapper, isDebug: false })(CategoryCard);
