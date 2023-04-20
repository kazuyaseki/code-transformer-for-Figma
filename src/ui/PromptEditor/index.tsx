import '!prismjs/themes/prism.css';
import {
  Button,
  Container,
  Tabs,
  VerticalSpace,
} from '@create-figma-plugin/ui';
import { h, JSX } from 'preact';
import { useState } from 'preact/hooks';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-markdown';
import Editor from 'react-simple-code-editor';
import { LayerTree } from '../../LayerTree/LayerTree';
import { OriginalNodeTree, SavedGqlQuery } from '../../types';
import { GqlEditor } from '../GqlEditor';
import styles from './styles.css';

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

export const PromptEditor: React.FC<Props> = ({
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

  return (
    <Tabs
      onChange={onChangeTab}
      options={[
        {
          children: (
            <div>
              <VerticalSpace space="medium" />
              <Container space="medium">
                <div>
                  <h3 class={styles.heading}>Prompt</h3>
                  <VerticalSpace space="medium" />
                  <div class={styles.editorContainer}>
                    <Editor
                      highlight={function (text: string) {
                        return highlight(text, languages.markdown, 'markdown');
                      }}
                      onValueChange={setPrompt}
                      preClassName={styles.editor}
                      textareaClassName={styles.editor}
                      value={prompt}
                    />
                  </div>
                </div>
                <VerticalSpace space="large" />

                {originalNodeTree && (
                  <LayerTree originalNodeTree={originalNodeTree} />
                )}

                <VerticalSpace space="large" />
                <Button
                  fullWidth
                  onClick={generateCode}
                  style={{ fontSize: '16px' }}
                >
                  Generate Code
                </Button>
              </Container>{' '}
              <VerticalSpace space="medium" />
            </div>
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
      ]}
      value={tabValue}
    />
  );
};
