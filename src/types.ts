import { EventHandler } from '@create-figma-plugin/utilities';

export interface InsertCodeHandler extends EventHandler {
  name: 'INSERT_CODE';
  handler: (code: string) => void;
}

export type GeneratedCodeType = {
  code: string;
  story: string;
};

export type OriginalNodeTree = {
  id: string;
  name: string;
  children?: OriginalNodeTree[];
};

export type SavedGqlQuery = {
  originalQuery: string;
  editingMode: 'query' | 'fragment';
};
