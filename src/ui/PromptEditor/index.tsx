import '!prismjs/themes/prism.css';
import { Button, Container, VerticalSpace } from '@create-figma-plugin/ui';
import { h, Fragment } from 'preact';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-markdown';
import Editor from 'react-simple-code-editor';
import { config } from '../../fct.config';
import { LayerTree } from '../../LayerTree/LayerTree';
import { OriginalNodeTree } from '../../types';
import styles from './styles.css';

type Props = {
  originalNodeTree: OriginalNodeTree | null;
  setPrompt: (prompt: string) => void;
  prompt: string;
  generateCode: () => void;
};

export const PromptEditor: React.FC<Props> = ({
  originalNodeTree,
  setPrompt,
  prompt,
  generateCode,
}) => {
  return (
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

        {config.useSeparateFileFeature && originalNodeTree && (
          <>
            <LayerTree originalNodeTree={originalNodeTree} />
            <VerticalSpace space="large" />
          </>
        )}

        <Button class={styles.button} fullWidth onClick={generateCode}>
          Generate Code
        </Button>
      </Container>
      <VerticalSpace space="medium" />
    </div>
  );
};
