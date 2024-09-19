import '!prismjs/themes/prism.css';
import { Tabs } from '@create-figma-plugin/ui';
import { h, JSX } from 'preact';
import { useState } from 'preact/hooks';
import 'prismjs/components/prism-markdown';
import { config } from '../../fct.config';
import { OriginalNodeTree, SavedGqlQuery } from '../../types';
import { GqlEditor } from '../GqlEditor';
import { PromptEditor } from '.';
import { SelectOption, CodeEditor } from '../CodeEditor'

type Props = {
  nodeId: string;
  query: SavedGqlQuery | null;
  showReult: boolean;
  setQuery: (query: SavedGqlQuery) => void;
  childFragmentStrings: string[];
  originalNodeTree: OriginalNodeTree | null;
  setPrompt: (prompt: string) => void;
  prompt: string;
  copyToClipboard: (content: string) => void;
  generateCode: () => void;
  setHtml: (htmlCode: string) => void;
  htmlCode: string;
  cssCode: string;
  setCSS: (cssCode: string) => void;
};

type TAB_VALUE = 'Prompt' | 'gql';

export const PromptHome: React.FC<Props> = ({
  nodeId,
  query,
  showReult,
  setQuery,
  childFragmentStrings,
  originalNodeTree,
  setPrompt,
  prompt,
  copyToClipboard,
  generateCode,
  setHtml,
  htmlCode,
  cssCode,
  setCSS,
}) => {
  const [tabValue, setTabValue] = useState<TAB_VALUE>('Prompt');

  const onChangeTab = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value as TAB_VALUE;
    setTabValue(newValue);
  };

  const tabOptions = [
    {
      children: (
        showReult ? <CodeEditor
        htmlCode={htmlCode || ""}
        cssCode={cssCode || ""}
        setCSS={setCSS}
        copyToClipboard={copyToClipboard}
        setHtml={setHtml}
      /> :  <PromptEditor
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
      }
  ];

  const displayTabs = tabOptions.filter(
    (option) => !(!config.useGqlEditor && option.value === 'gql')
  );

  if (displayTabs.length) {
    return displayTabs[0].children;
  }
  
  return (
    <div>
      <Tabs onChange={onChangeTab} options={displayTabs} value={tabValue} />
    </div>
  );
};
