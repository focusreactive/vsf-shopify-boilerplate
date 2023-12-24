/* eslint-disable no-use-before-define */
export type Edge = {
  node: Metaobject;
};

export type Reference = CollectionReference | ProductReference | PageReference | MediaImageReference;

export type ContentReferences = {
  edges: Edge[];
};

export type Field = {
  type: string;
  key: string;
  value: string;
  reference?: Reference;
};

export type Metaobject = {
  __typename: string;
  id: string;
  type: string;
  fields: Field[];
  handle?: string;
};

export type Seo = {
  title: string;
  description: string;
};

export type ContentMetafield = {
  id: string;
  key: string;
  namespace: string;
  value: string;
  references: ContentReferences;
};

export type PageData = {
  id: string;
  title: string;
  handle: string;
  seo: Seo;
  content: ContentMetafield;
};

export type LandingPageProps = {
  pageData: PageData;
  content: Metaobject[];
};

export type CollectionReference = {
  __typename: 'Collection';
  id: string;
  title: string;
  slug: string;
};

export type ProductReference = {
  __typename: 'Product';
  id: string;
  title: string;
  slug: string;
};

export type PageReference = {
  __typename: 'Page';
  id: string;
  title: string;
  slug: string;
};

export type MediaImageReference = {
  __typename: 'MediaImage';
  id: string;
  alt: string;
  image: {
    url: string;
    altText: string;
    width: number;
    height: number;
    id: string;
  };
};

export type RawImage = {
  __typename: 'MediaImage';
  id: string;
  alt: string;
  image: {
    url: string;
    altText: string | null;
    width: number;
    height: number;
    id: string;
  };
};

export type RawPage = {
  __typename: 'Page';
  id: string;
  title: string;
  slug: string;
};

export type RawProduct = {
  __typename: 'Product';
  id: string;
  title: string;
  slug: string;
};

export type RawCollection = {
  __typename: 'Collection';
  id: string;
  title: string;
  slug: string;
};

export type GeneralContentField = {
  type: string;
  key: string;
  value: string;
  reference?: GeneralComponent | RawImage | RawPage | RawProduct | RawCollection;
};

export type GeneralComponent = {
  __typename: string;
  id: string;
  type: string;
  fields: GeneralContentField[];
};

export type GeneralContentBlock = {
  __typename: 'Metaobject';
  id: string;
  type: string;
  fields: GeneralContentField[];
};

export type ContentResponse = GeneralContentBlock[];
