import { GQL_QUERY_KEY } from '../storage/keys';
import { SavedGqlQuery } from '../types';
import { convertQueryToFragment } from '../ui/GqlEditor/convertQueryToFragment';

function getSavedGqlQuery(node: SceneNode): SavedGqlQuery | null {
  const savedGqlQueryString = node.getPluginData(GQL_QUERY_KEY);
  let savedGqlQuery = null;
  try {
    savedGqlQuery = savedGqlQueryString
      ? (JSON.parse(savedGqlQueryString) as SavedGqlQuery)
      : null;
  } catch (e) {
    console.error('Parsing savedGqlQuery failed.');
  }
  return savedGqlQuery;
}

function addToFragments(
  savedGqlQuery: SavedGqlQuery | null,
  fragments: string[]
) {
  if (savedGqlQuery !== null && savedGqlQuery.editingMode === 'fragment') {
    const fragmentString = convertQueryToFragment(savedGqlQuery.originalQuery);
    fragments.push(fragmentString);
  }
}

export function getChildGqlFraments(node: SceneNode): string[] {
  const fragments: string[] = [];
  if ('children' in node) {
    node.children.forEach((child) => {
      const savedGqlQuery = getSavedGqlQuery(child);
      addToFragments(savedGqlQuery, fragments);

      if (child.type === 'INSTANCE' && child.mainComponent) {
        const mainComponentSavedGqlQuery = getSavedGqlQuery(
          child.mainComponent
        );
        addToFragments(mainComponentSavedGqlQuery, fragments);
      }

      fragments.push(...getChildGqlFraments(child));
    });
  }
  return fragments;
}
