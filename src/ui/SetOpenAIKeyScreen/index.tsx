import { Button, Textbox } from '@create-figma-plugin/ui';
import { h, JSX } from 'preact';
import { useState } from 'preact/hooks';
import styles from './styles.css';

type Props = {
  onSetKey: (url:string, key: string) => void;
};

export const SetOpenAIKeyScreen = ({ onSetKey }: Props) => {
  const [key, setKey] = useState<string>('04f8bf0560f343b5afc2234e29251b99');
  const [url, setUrl] = useState<string>('https://openaigpt4o2024.openai.azure.com/openai/deployments/gpt4o/chat/completions?api-version=2024-02-15-preview');

  const onChangeUrl = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    setUrl(event.currentTarget.value);
  };

  const onChangeKey = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    setKey(event.currentTarget.value);
  };

  const onSubmit = async (event: JSX.TargetedEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSetKey(url, key);
  };

  return (
    <div class={styles.container}>
      <h1 class={styles.heading}>Set Azure OpenAI URL & API Key</h1>
      <form onSubmit={onSubmit} class={styles.form}>
        <div>
          Azure OpenAI URL
          <Textbox
            name="url"
            onInput={onChangeUrl}
            value={url}
            variant="border"
            style={{ width: '320px' }}
          />
        </div>
        <div>
          API Key
          <Textbox
            name="key"
            onInput={onChangeKey}
            value={key}
            variant="border"
            style={{ width: '320px' }}
          />
        </div>
        <Button type="submit" disabled={url?.length === 0 || key?.length === 0}>
          Save
        </Button>
      </form>

      <div class={styles.texts}>
        <div class={styles.note}>
          <p>
            This Plugin is build using code in this repository, and won't use
            the key something malicious👍
          </p>
        </div>
        <p class={styles.alert}>
          Disclaimer: This plugin may not produce satisfying result without
          GPT-4 model
        </p>
      </div>
    </div>
  );
};
