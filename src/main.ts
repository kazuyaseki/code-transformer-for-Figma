import {
  getSelectedNodesOrAllNodes,
  showUI,
} from '@create-figma-plugin/utilities';
import { PLUGIN_WINDOW_HEIGHT_PX, PLUGIN_WINDOW_WIDTH_PX } from './constants';
import { buildOriginalLayerTree } from './figmaNode/buildOriginalLayerTree';
import { buildTagTree } from './figmaNode/buildTagTree';
import { divideTagTreeToChunks } from './figmaNode/divideTagTreeToChunks';
import { getChildGqlFraments } from './figmaNode/getChildGqlFraments';
import { removeUnnecessaryPropsFromTagTree } from './figmaNode/removeUnnecessaryPropsFromTagTree';
import { PluginToUiMessage, UiToPluginMessage } from './messaging';
import { GQL_QUERY_KEY } from './storage/keys';
import { SavedGqlQuery } from './types';

export default function () {
  const selectedNode = getSelectedNodesOrAllNodes()[0];
  const usedComponentNodes: ComponentNode[] = [];
  const savedGqlQueryString = selectedNode.getPluginData(GQL_QUERY_KEY);
  let savedGqlQuery = null;
  try {
    savedGqlQuery = savedGqlQueryString
      ? JSON.parse(savedGqlQueryString)
      : null;
  } catch (e) {
    console.error('Parsing savedGqlQuery failed.');
  }

  const childFragmentStrings = getChildGqlFraments(selectedNode);

  const thisTagTree = buildTagTree(selectedNode, usedComponentNodes);

  const originalNodeTree = buildOriginalLayerTree(selectedNode);

  if (!thisTagTree) {
    figma.notify('No visible nodes found');
    figma.closePlugin();
    return;
  }

  const chunks = divideTagTreeToChunks(thisTagTree);

  showUI({ height: PLUGIN_WINDOW_HEIGHT_PX, width: PLUGIN_WINDOW_WIDTH_PX });

  const msg: PluginToUiMessage = {
    type: 'sendSelectedNode',
    nodeId: selectedNode.id,
    chunks,
    nodeJSON: removeUnnecessaryPropsFromTagTree(thisTagTree),
    originalNodeTree,
    usedComponentNames: usedComponentNodes.map((node) => {
      const nodeName =
        node.parent?.type === 'COMPONENT_SET' ? node.parent.name : node.name;

      return nodeName.replace(/\s+/g, '');
    }),
    savedGqlQuery,
    childFragmentStrings,
  };
  figma.ui.postMessage(msg);

  figma.ui.onmessage = (msg: UiToPluginMessage) => {
    if (msg.type === 'save-gql-query') {
      const { nodeId, originalQuery, editingMode } = msg;
      const node = figma.currentPage.findOne((node) => node.id === nodeId);
      if (node) {
        const value: SavedGqlQuery = {
          originalQuery,
          editingMode,
        };
        node.setPluginData(GQL_QUERY_KEY, JSON.stringify(value));
        figma.notify('Query saved');
      }
    }
    if (msg.type === 'error-char-completion') {
      const { error } = msg;

      if (error.error.code === 'context_length_exceeded') {
        figma.notify(
          'Too large layer selected. Please consider separating files',
          { error: true }
        );
      } else {
        figma.notify('Error while generating code', { error: true });
      }
    }
  };
}
