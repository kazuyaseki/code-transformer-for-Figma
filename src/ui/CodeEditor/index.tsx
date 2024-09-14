import '!prismjs/themes/prism.css';
import {
  Button,
  Container,
  Tabs,
  Textbox,
  VerticalSpace,
} from '@create-figma-plugin/ui';
import { h, JSX } from 'preact';
import { highlight, languages } from 'prismjs';
import { useState } from 'react';
import Select from 'react-select';
import Editor from 'react-simple-code-editor';
import styles from './styles.css';

type Props = {
  setCode: (code: string) => void;
  code: string;
  story: string;
  setStory: (story: string) => void;
  setBranchName: (branchName: string) => void;
  branchName: string;
  setCommitMessage: (commitMessage: string) => void;
  commitMessage: string;
  prTitle: string;
  setPrTitle: (prTitle: string) => void;
  copyToClipboard: (content: string) => void;
  selectedDirectory: SelectOption | null;
  setSelectedDirectory: (selectedDirectory: SelectOption) => void;
  directoryNames: string[];
};

export type SelectOption = {
  label: string;
  value: string;
};

export const CodeEditor: React.FC<Props> = ({
  setCode,
  code,
  story,
  setStory,
  setBranchName,
  branchName,
  setCommitMessage,
  commitMessage,
  prTitle,
  setPrTitle,
  copyToClipboard,
  selectedDirectory,
  setSelectedDirectory,
  directoryNames,
}) => {
  const [tabValue, setTabValue] = useState<string>('code');
  const options = [
    {
      children: (
        <div class={styles.editorContainer}>
          <Editor
            highlight={function (code: string) {
              return highlight(code, languages.js, 'js');
            }}
            onValueChange={setCode}
            preClassName={styles.editor}
            textareaClassName={styles.editor}
            value={code}
          />
        </div>
      ),
      value: 'code',
    },
    {
      children: (
        <div class={styles.editorContainer}>
          <Editor
            highlight={function (story: string) {
              return highlight(story, languages.js, 'js');
            }}
            onValueChange={setStory}
            preClassName={styles.editor}
            textareaClassName={styles.editor}
            value={story}
          />
        </div>
      ),
      value: 'story',
    },
  ];

  const directoryOptions = directoryNames.map((directoryName) => ({
    label: directoryName,
    value: directoryName,
  }));

  const onChangeTab = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value;
    setTabValue(newValue);
  };

  return (
    <Container space="medium">
      <VerticalSpace space="small" />
      <Tabs onChange={onChangeTab} options={options} value={tabValue} />

      <VerticalSpace space="large" />

      <form
        class={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const text = formData.get('text') as string;
          copyToClipboard(text);
        }}
      >

        <Button fullWidth type="submit" style={{ fontSize: '16px' }}>
          Copy to clipboard
        </Button>
      </form>

      <VerticalSpace space="small" />
    </Container>
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
