import { useEffect, useState } from 'preact/hooks';
import {
  buildPromptForGeneratingCode,
  buildPromptForGeneratingCodeForChunk,
  buildPromptForPropsSummary,
} from '../chatGPT/buildPrompt';
import { createChatCompletion } from '../chatGPT/createChatCompletion';
import { Tag } from '../figmaNode/buildTagTree';
import { fetchComponentFileContent } from '../github/fetchComponentFileContent';
import { PluginToUiMessage } from '../messaging';
import { OriginalNodeTree, SavedGqlQuery } from '../types';
import { useDebounce } from '../utils/useDebounce';

export const useFigmaLayerData = (openAIAPIKey: string) => {
  const [prompt, setPrompt] = useState<string>('');
  const [originalNode, setOriginalNodeTree] = useState<OriginalNodeTree | null>(
    null
  );
  const [nodeId, setNodeId] = useState<string>('');
  const [gqlQuery, setGqlQuery] = useState<SavedGqlQuery | null>(null);
  const [childFragmentStrings, setChildFragmentStrings] = useState<string[]>(
    []
  );
  const [chunks, setChunks] = useState<Tag[]>([]);
  const [propsSummaries, setPropsSummaries] = useState<string[]>([]);
  const [frontendLibrary, setFrontendLibrary] = useState('');
  const debouncedFrontendLibraryName = useDebounce(frontendLibrary, 400);

  useEffect(
    () => {
      const nodeJSON = removeIdFromNode(
        JSON.parse(JSON.stringify(originalNode))
      );

      setPrompt(
        buildPromptForGeneratingCode(
          JSON.stringify(nodeJSON),
          propsSummaries,
          undefined,
          debouncedFrontendLibraryName
        )
      );
    },
    [debouncedFrontendLibraryName] // Only call effect if debounced search term changes
  );

  const onChangeFrontendLibrary = (newValue: string) => {
    setFrontendLibrary(newValue);
  };

  const setInitialData = async (pluginMessage: PluginToUiMessage) => {
    if (pluginMessage.type !== 'sendSelectedNode') return;

    const {
      nodeJSON,
      originalNodeTree,
      nodeId,
      savedGqlQuery,
      usedComponentNames,
      childFragmentStrings,
      chunks: _chunks,
    } = pluginMessage;

    setChunks(_chunks);

    let _propsSummaries: string[] = [];

    const uniqueComponentNames = usedComponentNames.filter(
      (name, index, self) => self.indexOf(name) === index
    );
    // FIXME: enable specifying this flug from pluguin UI
    const includePropsSummaries = false;
    if (includePropsSummaries) {
      const files = await Promise.all(
        uniqueComponentNames.map((componentName) => {
          // NOTE: specify paths for directory where components are stored
          const componentDirectoryPaths = [
            {
              owner: process.env.REPOSITORY_OWNER as string,
              repo: process.env.REPOSITORY_NAME as string,
              path: `src/components/${componentName}`,
            },
          ];

          return fetchComponentFileContent(componentDirectoryPaths);
        })
      );

      _propsSummaries = await Promise.all(
        files
          .filter(Boolean)
          .map((fileContent) =>
            buildPromptForPropsSummary(
              fileContent!.componentName,
              fileContent!.content
            )
          )
          .map((summaryPrompt) =>
            createChatCompletion(openAIAPIKey, summaryPrompt, [], true)
          )
      );

      setPropsSummaries(_propsSummaries);
    }

    setOriginalNodeTree(originalNodeTree);
    setNodeId(nodeId);
    setGqlQuery(savedGqlQuery);
    setChildFragmentStrings(childFragmentStrings);

    const _nodeJSON = removeIdFromNode(JSON.parse(JSON.stringify(nodeJSON)));
    const prompt = buildPromptForGeneratingCode(
      JSON.stringify(_nodeJSON),
      propsSummaries,
      undefined,
      frontendLibrary
    );

    setPrompt(prompt);
  };

  return {
    prompt,
    originalNode,
    nodeId,
    gqlQuery,
    childFragmentStrings,
    chunks,
    propsSummaries,
    setInitialData,
    setPrompt,
    setGqlQuery,
    frontendLibrary,
    onChangeFrontendLibrary,
  };
};

function removeIdFromNode(node: Tag) {
  if (node === null) return node;

  if ('id' in node) {
    delete node.id;
  }

  if ('children' in node) {
    node.children = node.children.map(removeIdFromNode);
  }

  return node;
}
