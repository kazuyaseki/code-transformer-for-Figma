import { h } from 'preact';
import { useState } from 'preact/hooks';
import { useEffect } from 'react';
import { OriginalNodeTree } from '../types';
import styles from './styles.css';

type TreeComponentProps = {
  originalNodeTree: OriginalNodeTree;
  selectedNodes: string[];
  onSelectNode: (id: string) => void;
  searchQuery: string;
  expandAll: boolean;
  isRootChild?: boolean;
};

const TreeNode: React.FC<TreeComponentProps> = ({
  originalNodeTree,
  selectedNodes,
  onSelectNode,
  expandAll,
  searchQuery,
  isRootChild,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(expandAll);
  }, [expandAll]);

  useEffect(() => {
    // This is a hack to make sure that the child nodes of the root node are open at the first render
    setTimeout(() => {
      setIsOpen(!!isRootChild);
    }, 150);
  }, [isRootChild]);

  const handleNodeClick = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectNode = (e: any) => {
    e.stopPropagation();
    onSelectNode(originalNodeTree.id);
  };

  const isSelected = selectedNodes.includes(originalNodeTree.id);

  const shouldShowNode = originalNodeTree.name
    .toLowerCase()
    .includes(searchQuery.toLowerCase());

  if (!shouldShowNode) {
    return null;
  }

  return (
    <div className={styles['tree-node']}>
      <div
        className={`${styles['node-content']} ${
          isSelected ? styles.selected : ''
        }`}
        onClick={handleSelectNode}
      >
        {originalNodeTree.children && originalNodeTree.children.length > 0 && (
          <span
            className={`${styles['toggle-icon']} ${
              isOpen ? 'open' : styles.closed
            }`}
            onClick={handleNodeClick}
          >
            ▸
          </span>
        )}
        {originalNodeTree.name}
      </div>
      {isOpen &&
        originalNodeTree.children &&
        originalNodeTree.children.map((child) => (
          <TreeNode
            key={child.id}
            originalNodeTree={child}
            selectedNodes={selectedNodes}
            onSelectNode={onSelectNode}
            searchQuery={searchQuery}
            expandAll={expandAll}
          />
        ))}
    </div>
  );
};

export const LayerTree: React.FC<{ originalNodeTree: OriginalNodeTree }> = ({
  originalNodeTree,
}) => {
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandAll, setExpandAll] = useState(false);

  const handleSelectNode = (id: string) => {
    if (selectedNodes.includes(id)) {
      setSelectedNodes(selectedNodes.filter((nodeId) => nodeId !== id));
    } else {
      setSelectedNodes([...selectedNodes, id]);
    }
  };

  const handleClearSelectedNodes = () => {
    setSelectedNodes([]);
  };

  const handleSearchChange = (e: any) => {
    setSearchQuery(e.target.value);
  };

  const handleExpandAll = () => {
    setExpandAll(!expandAll);
  };

  const findNodeById = (
    id: string,
    tree: OriginalNodeTree
  ): OriginalNodeTree | null => {
    if (tree.id === id) {
      return tree;
    }

    if (tree.children) {
      for (const child of tree.children) {
        const foundNode = findNodeById(id, child);
        if (foundNode) {
          return foundNode;
        }
      }
    }

    return null;
  };

  const selectedNodeNames = selectedNodes
    .map((id) => findNodeById(id, originalNodeTree)?.name || '')
    .join(', ');

  return (
    <div>
      <div className={styles.actions}>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button onClick={handleExpandAll}>
          {expandAll ? 'Collapse All' : 'Expand All'}
        </button>
        <button onClick={handleClearSelectedNodes}>Clear selected nodes</button>
      </div>
      <div>
        <strong>Selected Nodes: </strong>
        {selectedNodeNames || 'None'}
      </div>
      <TreeNode
        originalNodeTree={originalNodeTree}
        selectedNodes={selectedNodes}
        onSelectNode={handleSelectNode}
        searchQuery={searchQuery}
        expandAll={expandAll}
        isRootChild
      />
    </div>
  );
};
