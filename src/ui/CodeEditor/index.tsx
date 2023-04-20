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
  generatePR: () => void;
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
  generatePR,
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
          generatePR();
        }}
      >
        <div class={styles.formFields}>
          <TextboxWithLabel
            label="repository name"
            onChanged={() => {}}
            value={'gaudiy-monorepo'}
            textBoxProps={{ readOnly: true }}
          />

          {directoryNames.length > 0 && (
            <div class={styles.textboxContainer}>
              <h4 class={styles.textboxContainerLabel}>
                directory to create files
              </h4>
              <Select
                // @ts-ignore
                // see https://github.com/JedWatson/react-select/issues/5032
                options={directoryOptions}
                value={selectedDirectory}
                onChange={(newValue) =>
                  setSelectedDirectory(newValue as SelectOption)
                }
                styles={{
                  menuList: (provided) => ({
                    ...provided,
                    zIndex: 9999,
                  }),
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 9999,
                  }),
                }}
              />
            </div>
          )}

          <TextboxWithLabel
            label="branch name"
            onChanged={(newValue) => setBranchName(newValue)}
            value={branchName}
          />

          <TextboxWithLabel
            label="commit message"
            onChanged={(newValue) => setCommitMessage(newValue)}
            value={commitMessage}
          />

          <TextboxWithLabel
            label="pull request title"
            onChanged={(newValue) => setPrTitle(newValue)}
            value={prTitle}
          />
        </div>

        <Button fullWidth type="submit" style={{ fontSize: '16px' }}>
          Create PR
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
