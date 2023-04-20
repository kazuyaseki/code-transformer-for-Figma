import { OriginalNodeTree } from '../types';

export const buildOriginalLayerTree = (node: SceneNode): OriginalNodeTree => {
  const children: OriginalNodeTree[] = [];
  if ('children' in node) {
    node.children.forEach((child) => {
      children.push(buildOriginalLayerTree(child));
    });
  }
  return {
    id: node.id,
    name: node.name,
    children,
  };
};
