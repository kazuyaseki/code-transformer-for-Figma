import '!prismjs/themes/prism.css';
import {
  Button,
  Container,
  Textbox,
  VerticalSpace,
} from '@create-figma-plugin/ui';
import { h, JSX } from 'preact';
import { highlight, languages } from 'prismjs';
import Editor from 'react-simple-code-editor';
import styles from './styles.css';
import MockHtmlRes from '../MockHtmlRes/MockHtmlRes';

type Props = {
  setHtml: (htmlCode: string) => void;
  htmlCode: string;
  cssCode: string;
  setCSS: (cssCode: string) => void;
  copyToClipboard: (content: string) => void;
};

export type SelectOption = {
  label: string;
  value: string;
};

export const CodeEditor: React.FC<Props> = ({
  setHtml,
  htmlCode,
  cssCode,
  setCSS,
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
              highlight={function (htmlCode: string) {
                return highlight(htmlCode, languages.js, 'js');
              }}
              onValueChange={setHtml}
              preClassName={styles.editor}
              textareaClassName={styles.editor}
              value={htmlCode}
            />
          </div>
          <VerticalSpace space="small" />
          <Button class={styles.button} fullWidth onClick={(e) => {
            e.preventDefault();
            copyToClipboard(htmlCode);
          }}>
            Copy to clipboard
          </Button>
        </div>
        <VerticalSpace space="medium" />

        <div>
          <h3 class={styles.heading}>css</h3>
          <VerticalSpace space="small" />
          <div class={styles.editorContainer}>
            <Editor
              highlight={function (cssCode: string) {
                return highlight(cssCode, languages.css, 'css');
              }}
              onValueChange={setCSS}
              preClassName={styles.editor}
              textareaClassName={styles.editor}
              value={cssCode}
            />
          </div>
          <VerticalSpace space="small" />
          <Button class={styles.button} fullWidth onClick={(e) => {
            e.preventDefault();
            copyToClipboard(cssCode);
          }}>
            Copy to clipboard
          </Button>
        </div>
        <VerticalSpace space="large" />
      </Container>
      <VerticalSpace space="medium" />
      <h3 class={styles.heading}>Check your UX</h3>
      <VerticalSpace space="medium" />
      <MockHtmlRes htmlString={htmlCode} cssString={cssCode} />
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
