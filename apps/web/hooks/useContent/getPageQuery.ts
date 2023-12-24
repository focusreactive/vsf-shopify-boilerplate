export const getPageQuery = `#graphql
query GetPage($slug: String!) {
  page(handle: $slug) {
    id
    title
    handle
    seo {
      title
      description
    }
    content: metafield(namespace: "custom", key: "content") {
      id
      key
      namespace
      value
      references(first: 50) {
        edges {
          node {
            __typename
            ... on Metaobject {
              id
              type
              fields {
                type
                key
                value
                reference {
                  __typename
                  ... on Collection {
                    id
                    title
                    slug: handle
                  }
                  ... on Product {
                    id
                    title
                    slug: handle
                  }
                  ... on Metaobject {
                    id
                    handle
                    type
                    fields {
                      key
                      type
                      value
                      reference {
                        __typename
                        ... on Page {
                          id
                          title
                          slug: handle
                        }
                        ... on MediaImage {
                          id
                          alt
                          image {
                            url
                            altText
                            width
                            height
                            id
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`;
