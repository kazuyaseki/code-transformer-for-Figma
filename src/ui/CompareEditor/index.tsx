import '!prismjs/themes/prism.css';
import { Button, Container, VerticalSpace } from '@create-figma-plugin/ui';
import { h, Fragment } from 'preact';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-markdown';
import Editor from 'react-simple-code-editor';
import { OriginalNodeTree } from '../../types';
import styles from './styles.css';

type Props = {
  setHtml: (htmlCode: string) => void;
  htmlCode: string;
  cssCode: string;
  setCSS: (cssCode: string) => void;
  setPrompt: (prompt: string) => void;
  prompt: string;
  compareCode: () => void;
  copyToClipboard: (content: string) => void;
};

export const CompareEditor: React.FC<Props> = ({
  setHtml,
  htmlCode,
  cssCode,
  setCSS,
  setPrompt,
  prompt,
  compareCode,
  copyToClipboard
}) => {
  return (
    <div>
      <VerticalSpace space="medium" />
      <Container space="medium">
        <div>
          <h3 class={styles.heading}>html</h3>
          <VerticalSpace space="small" />
          <div class={styles.editorContainer}>
            <Editor
              highlight={function (text: string) {
                return highlight(text, languages.markdown, 'js');
              }}
              onValueChange={setHtml}
              preClassName={styles.editor}
              textareaClassName={styles.editor}
              value={htmlCode}
            />
          </div>
        </div>
        <VerticalSpace space="medium" />

        <div>
          <h3 class={styles.heading}>css</h3>
          <VerticalSpace space="small" />
          <div class={styles.editorContainer}>
            <Editor
              highlight={function (text: string) {
                return highlight(text, languages.markdown, 'css');
              }}
              onValueChange={setCSS}
              preClassName={styles.editor}
              textareaClassName={styles.editor}
              value={cssCode}
            />
          </div>
        </div>
        <VerticalSpace space="medium" />

        <div>
          <h3 class={styles.heading}>Prompt</h3>
          <VerticalSpace space="small" />
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

        <Button class={styles.button} fullWidth onClick={compareCode}>
          Compare
        </Button>
      </Container>
      <VerticalSpace space="medium" />
    </div>
  );
};
