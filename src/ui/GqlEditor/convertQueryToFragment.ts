import { FragmentDefinitionNode, Kind, parse, print } from 'graphql';

export function convertQueryToFragment(queryString: string): string {
  const ast = parse(queryString);
  const fragments: FragmentDefinitionNode[] = [];

  ast.definitions.forEach((definition) => {
    if (definition.kind === 'OperationDefinition') {
      definition.selectionSet.selections.forEach((selection) => {
        if (selection.kind === 'Field') {
          const typeName =
            selection.name.value.charAt(0).toUpperCase() +
            selection.name.value.slice(1);
          const fragmentName = `${typeName}Fields`;

          const fragment: FragmentDefinitionNode = {
            kind: Kind.FRAGMENT_DEFINITION,
            name: { kind: Kind.NAME, value: fragmentName },
            typeCondition: {
              kind: Kind.NAMED_TYPE,
              name: { kind: Kind.NAME, value: typeName },
            },
            selectionSet: selection.selectionSet!,
          };

          fragments.push(fragment);
        }
      });
    }
  });

  return fragments.map((fragment) => print(fragment)).join('\n');
}
