import {
  DocumentNode,
  FieldNode,
  FragmentDefinitionNode,
  Kind,
  OperationDefinitionNode,
  parse,
  print,
} from 'graphql';

export function mergeQueryAndFragments(
  queryString: string,
  fragmentsStrings: string[]
): string {
  const queryAST = parse(queryString);
  const fragmentMap = new Map<string, FragmentDefinitionNode>();

  fragmentsStrings.forEach((fragmentString) => {
    const fragmentsAST = parse(fragmentString);
    fragmentsAST.definitions.forEach((definition) => {
      if (definition.kind === 'FragmentDefinition') {
        fragmentMap.set(definition.typeCondition.name.value, definition);
      }
    });
  });

  const newSelections: FieldNode[] = [];
  fragmentMap.forEach((fragment, typeName) => {
    const fieldName = typeName.charAt(0).toLowerCase() + typeName.slice(1);
    const newField: FieldNode = {
      kind: Kind.FIELD,
      name: { kind: Kind.NAME, value: fieldName },
      selectionSet: {
        kind: Kind.SELECTION_SET,
        selections: [{ kind: Kind.FRAGMENT_SPREAD, name: fragment.name }],
      },
    };
    newSelections.push(newField);
  });

  const newQueryAST: DocumentNode = {
    kind: Kind.DOCUMENT,
    definitions: queryAST.definitions.map((definition) => {
      if (definition.kind === 'OperationDefinition') {
        return {
          ...definition,
          selectionSet: {
            ...definition.selectionSet,
            selections: [
              ...definition.selectionSet.selections.map((selection) => {
                if (selection.kind === 'Field') {
                  const typeName =
                    selection.name.value.charAt(0).toUpperCase() +
                    selection.name.value.slice(1);
                  const fragment = fragmentMap.get(typeName);

                  if (fragment) {
                    fragmentMap.delete(typeName);

                    const selectionSet = selection.selectionSet
                      ? {
                          ...selection.selectionSet!,
                          selections: [
                            ...selection.selectionSet!.selections,
                            {
                              kind: 'FragmentSpread',
                              name: fragment.name,
                            },
                          ],
                        }
                      : {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'FragmentSpread',
                              name: fragment.name,
                            },
                          ],
                        };

                    return {
                      ...selection,
                      selectionSet,
                    };
                  }
                }
                return selection;
              }),
              ...newSelections.filter((field) => {
                const typeName =
                  field.name.value.charAt(0).toUpperCase() +
                  field.name.value.slice(1);
                return fragmentMap.has(typeName);
              }),
            ],
          },
        } as OperationDefinitionNode;
      }

      return definition;
    }),
  };

  return print(newQueryAST);
}
