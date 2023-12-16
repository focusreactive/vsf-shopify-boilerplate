type GraphQLObject<OBJ> = OBJ;

export const flattenArray = <OBJ>(data: { edges: { node: GraphQLObject<OBJ> }[] }): GraphQLObject<OBJ>[] => {
  return data.edges.map((edge: { node: GraphQLObject<OBJ> }) => {
    return {
      ...edge.node,
    };
  });
};
