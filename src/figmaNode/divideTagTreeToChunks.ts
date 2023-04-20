import {
  APPROX_TOKEN_COUNT_PER_CHARACTER,
  MAX_TOKEN_COUNT_FOR_CODE,
} from '../constants';
import { Tag } from './buildTagTree';

function getTokenCount(tag: Tag) {
  const stringLength = JSON.stringify(tag).length;
  return stringLength * APPROX_TOKEN_COUNT_PER_CHARACTER;
}

export const divideTagTreeToChunks = (tag: Tag): Tag[] => {
  let totalTokenCount = getTokenCount(tag);
  if (totalTokenCount < MAX_TOKEN_COUNT_FOR_CODE) {
    return [];
  }

  let result: Tag[] = [];

  // 全部の node を探索して {node, childIndex, parentNodeRef} の配列を作り、トークンカウントでソートする
  const nodes: {
    node: Tag;
    childIndex: number;
    parentNodeRef: Tag | null;
  }[] = [];
  const traverse = (
    node: Tag,
    childIndex: number,
    parentNodeRef: Tag | null
  ) => {
    nodes.push({ node, childIndex, parentNodeRef });
    if ('children' in node) {
      node.children.forEach((child, index) => {
        traverse(child, index, node);
      });
    }
  };
  traverse(tag, 0, null);
  nodes.sort((a, b) => getTokenCount(b.node) - getTokenCount(a.node));

  // トークンカウントがmaxChunkSizeより小さいもので多い順に chunk に追加していく
  nodes.forEach(({ node, childIndex, parentNodeRef }) => {
    if (totalTokenCount < MAX_TOKEN_COUNT_FOR_CODE) {
      return;
    }

    const tokenCount = getTokenCount(node);
    if (
      tokenCount < MAX_TOKEN_COUNT_FOR_CODE &&
      'id' in node &&
      parentNodeRef &&
      'children' in parentNodeRef
    ) {
      console.log('push', node.name);
      result.push(node);
      parentNodeRef.children[childIndex] = {
        nodeId: node.id || '',
        isChunk: true,
      };

      totalTokenCount = getTokenCount(tag);
    }
  });

  return result;
};
