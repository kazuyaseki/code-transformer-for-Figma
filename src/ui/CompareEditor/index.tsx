import '!prismjs/themes/prism.css';
import { Button, Container, VerticalSpace } from '@create-figma-plugin/ui';
import { h, Fragment, JSX } from 'preact';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-markdown';
import Editor from 'react-simple-code-editor';
import styles from './styles.css';

type Props = {
  showReult: boolean;
  setHtml: (htmlCode: string) => void;
  htmlCode: string;
  cssCode: string;
  compareResult: string;
  setCSS: (cssCode: string) => void;
  setPrompt: (prompt: string) => void;
  prompt: string;
  compareCode: () => void;
  copyToClipboard: (content: string) => void;
  generatePrompt: () => void;
};

export const CompareEditor: React.FC<Props> = ({
  showReult,
  compareResult,
  setHtml,
  htmlCode,
  cssCode,
  setCSS,
  setPrompt,
  prompt,
  compareCode,
  generatePrompt,
  copyToClipboard
}) => {

  if (compareResult && showReult) {
    return (
      <div>
        <VerticalSpace space="medium" />
        <Container space="medium">
          <h3 class={styles.heading}>compare result</h3>
          <VerticalSpace space="small" />
          <div class={styles.editorContainer}>
            <Editor
              highlight={function (text: string) {
                return highlight(text, languages.plaintext, 'plaintext');
              }}
              onValueChange={() => {}}
              preClassName={styles.editor}
              textareaClassName={styles.editor}
              value={compareResult}
            />
          </div>
          <VerticalSpace space="medium" />
        </Container>
      </div>
    )
  }

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
                  return highlight(text, languages.html, 'html');
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
                  return highlight(text, languages.css, 'css');
                }}
                onValueChange={setCSS}
                preClassName={styles.editor}
                textareaClassName={styles.editor}
                value={cssCode}
              />
            </div>
          </div>
          <VerticalSpace space="medium" />
          <Button class={styles.button} fullWidth onClick={generatePrompt}>
            Generate Prompt
          </Button>
          <div>
            <h3 class={styles.heading}>Prompt</h3>
            <VerticalSpace space="small" />
            <div class={styles.editorContainer}>
              <Editor
                highlight={function (text: string) {
                  return highlight(text, languages.plaintext, 'plaintext');
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
