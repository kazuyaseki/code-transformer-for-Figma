import '!prismjs/themes/prism.css';
import { Tabs } from '@create-figma-plugin/ui';
import { h, JSX } from 'preact';
import { useState } from 'preact/hooks';
import 'prismjs/components/prism-markdown';
import { config } from '../../fct.config';
import { OriginalNodeTree, SavedGqlQuery } from '../../types';
import { GqlEditor } from '../GqlEditor';
import { PromptEditor } from '../PromptEditor';

type Props = {
  originalNodeTree: OriginalNodeTree | null;
  setPrompt: (prompt: string) => void;
  prompt: string;
  generateCode: () => void;
  nodeId: string;
  query: SavedGqlQuery | null;
  setQuery: (query: SavedGqlQuery) => void;
  childFragmentStrings: string[];
};

type TAB_VALUE = 'Prompt' | 'gql';

export const Home: React.FC<Props> = ({
  originalNodeTree,
  setPrompt,
  prompt,
  generateCode,
  nodeId,
  query,
  setQuery,
  childFragmentStrings,
}) => {
  const [tabValue, setTabValue] = useState<TAB_VALUE>('Prompt');

  const onChangeTab = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value as TAB_VALUE;
    setTabValue(newValue);
  };

  const tabOptions = [
    {
      children: (
        <PromptEditor
          originalNodeTree={originalNodeTree}
          setPrompt={setPrompt}
          prompt={prompt}
          generateCode={generateCode}
        />
      ),
      value: 'Prompt',
    },
    {
      children: (
        <GqlEditor
          nodeId={nodeId}
          query={query}
          setQuery={setQuery}
          childFragmentStrings={childFragmentStrings}
        />
      ),
      value: 'gql',
    },
  ];

  return (
    <Tabs
      onChange={onChangeTab}
      options={tabOptions.filter(
        (option) => !(!config.useGqlEditor && option.value === 'gql')
      )}
      value={tabValue}
    />
  );
};
