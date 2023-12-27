/* eslint-disable no-use-before-define */
type Component = {
  __typename: string;
  id: string;
  type: string;
  fields: ContentField[];
};

type ContentField = {
  type: string;
  key: string;
  value: string;
  reference?: Component | null;
};

type ContentBlock = {
  __typename: string;
  id: string;
  type: string;
  fields: ContentField[];
};
