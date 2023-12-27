import Image from 'next/image';
import Link from 'next/link';
import { SfButton } from '@storefront-ui/react';
import classNames from 'classnames';
import { Heading, type DisplayProps } from '~/components';
import withShopify, { ShopifyBlock } from '~/sdk/shopify/withShopify';

export function Display({ items, title, ...attributes }: DisplayProps) {
  return (
    <>
      <Heading
        title={title}
        tag={'h2'}
        className="text-center mb-6 font-bold typography-headline-3 md:typography-headline-2"
      />

      <div
        className="flex flex-col md:flex-row flex-wrap gap-6 max-w-screen-3xl mx-auto px-4 md:px-10 mb-10"
        data-testid="display"
        {...attributes}
      >
        {items.map(
          ({
            image,
            title,
            subtitle,
            description,
            buttonText,
            buttonLink,
            reverse,
            titleClass,
            subtitleClass,
            cardColor,
          }) => (
            <div
              key={title}
              style={{ backgroundColor: cardColor }}
              className="relative flex md:max-w-screen-3xl md:[&:not(:first-of-type)]:flex-1 md:first-of-type:w-full first:bg-secondary-200 last:bg-warning-200 even:bg-negative-200"
            >
              <div
                className={classNames('flex overflow-hidden grow flex-col', {
                  'flex-col-reverse': reverse,
                  'md:flex-row-reverse': reverse,
                })}
              >
                <div className="flex flex-1 flex-col justify-center items-center md:items-start p-6 lg:p-10 max-w-1/2">
                  <p
                    className={classNames(
                      'uppercase typography-text-xs block font-bold tracking-widest',
                      subtitleClass,
                    )}
                  >
                    {subtitle}
                  </p>
                  <h2 className={classNames('mb-4 mt-2 font-bold typography-headline-3', titleClass)}>{title}</h2>
                  <p className="typography-text-base block text-center md:text-left mb-4">{description}</p>
                  <SfButton className="!bg-black" as={Link} href={buttonLink}>
                    {buttonText}
                  </SfButton>
                </div>
                <Image
                  src={image}
                  alt={title}
                  className="w-full md:w-1/2 self-end object-contain flex-1"
                  height={300}
                  width={300}
                />
              </div>
            </div>
          ),
        )}
      </div>
    </>
  );
}

type MediaImage = {
  contentType: 'MediaImage';
  alt: string;
  url: string;
  altText: string | null;
  width: number;
  height: number;
  id: string;
};

type PageLink = {
  __typename: 'Page';
  id: string;
  title: string;
  slug: string;
};

type DisplayCardFields = {
  card_color: string;
  cta_text: string;
  description: string; // JSON string for rich text content
  image: MediaImage;
  page: PageLink;
  reverse: string; // "true" or "false" as string
  subtitle: string;
  title: string;
};

type CardItem = {
  id: string;
  contentType: string;
  fields: DisplayCardFields;
};

type DisplayBlockFieldsType = {
  title: string;
  card_1: CardItem;
  card_2: CardItem;
  card_3: CardItem;
};

const processLink = (page: PageLink | { __typename: string; slug: string }) => {
  switch (page.__typename) {
    case 'Page': {
      return `/${page.slug}`;
    }
    case 'Collection': {
      return `collection/${page.slug}`;
    }
    case 'Product': {
      return `product/${page.slug}`;
    }
    default: {
      throw new Error(`Define the handler for ${page.__typename} here`);
    }
  }
};

const processCard = (cardItem: CardItem) => {
  const card = cardItem.fields;

  // Parsing the description as it's a JSON string for rich text content
  let descriptionText = '';
  try {
    const parsedDescription = JSON.parse(card.description);
    // Assuming the structure of the rich text is as provided in the JSON example.
    // Adjust the extraction logic based on the actual structure.
    descriptionText = parsedDescription.children
      .map((paragraph: { children: { value: string }[] }) =>
        paragraph.children.map((text: { value: string }) => text.value).join(''),
      )
      .join(' ');
  } catch (e) {
    console.error('Error parsing description:', e);
  }

  return {
    image: card.image?.url,
    title: card.title,
    subtitle: card.subtitle,
    description: descriptionText,
    buttonText: card.cta_text,
    buttonLink: processLink(card.page),
    reverse: card.reverse === 'true',
    titleClass: '',
    subtitleClass: '',
    cardColor: card.card_color,
  };
};

const wrapper = (contentBlock: ShopifyBlock<DisplayBlockFieldsType>): DisplayProps => {
  // Extracting card data from contentBlock.fields
  const { card_1, card_2, card_3, title } = contentBlock.fields;
  const items = [card_1, card_2, card_3].map((cardItem) => processCard(cardItem));

  return { items, title };
};

export const DisplayBlock = withShopify({ wrapperFn: wrapper, isDebug: false })(Display);
