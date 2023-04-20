import { Tag } from './buildTagTree';

export function removeUnnecessaryPropsFromTagTree(tag: Tag): Tag {
  if ('id' in tag) {
    delete tag.id;
  }

  if ('children' in tag) {
    return {
      ...tag,
      children: tag.children.map((child) =>
        removeUnnecessaryPropsFromTagTree(child)
      ),
    };
  }
  return tag;
}
