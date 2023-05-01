import '!prismjs/themes/prism.css';
import {
  Button,
  Container,
  Textbox,
  VerticalSpace,
} from '@create-figma-plugin/ui';
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
  frontendLibrary: string;
  onChangeFrontendLibrary: (newValue: string) => void;
};

export const PromptEditor: React.FC<Props> = ({
  originalNodeTree,
  setPrompt,
  prompt,
  generateCode,
  frontendLibrary,
  onChangeFrontendLibrary,
}) => {
  return (
    <div>
      <VerticalSpace space="medium" />
      <Container space="medium">
        {config.buildForCommunityPlugin && (
          <>
            <VerticalSpace space="medium" />
            <TextboxWithLabel
              label="Name of frontend library to render(defaults to React, TypeScript, Tailwind)"
              onChanged={onChangeFrontendLibrary}
              value={frontendLibrary}
            />
            <VerticalSpace space="medium" />
          </>
        )}

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

        <Button fullWidth onClick={generateCode} style={{ fontSize: '16px' }}>
          Generate Code
        </Button>
      </Container>
      <VerticalSpace space="medium" />
    </div>
  );
};

function TextboxWithLabel(props: {
  onChanged: (newValue: string) => void;
  value: string;
  label: string;
  textBoxProps?: Partial<React.ComponentProps<typeof Textbox>>;
}) {
  return (
    <div class={styles.textboxContainer}>
      <h4 class={styles.textboxContainerLabel}>{props.label}</h4>
      <Textbox
        onInput={(e) => props.onChanged(e.currentTarget.value)}
        value={props.value}
        variant="border"
        {...props.textBoxProps}
      />
    </div>
  );
}
