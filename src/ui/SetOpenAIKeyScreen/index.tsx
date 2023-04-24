import { Button, Textbox } from '@create-figma-plugin/ui';
import { h, JSX } from 'preact';
import { useState } from 'preact/hooks';
import styles from './styles.css';

type Props = {
  onSetKey: (key: string) => void;
};

export const SetOpenAIKeyScreen = ({ onSetKey }: Props) => {
  const [key, setKey] = useState<string>('');

  const onChangeKey = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    setKey(event.currentTarget.value);
  };

  const onSubmit = async (event: JSX.TargetedEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSetKey(key);
  };

  return (
    <div class={styles.container}>
      <h1 class={styles.heading}>Set OpenAI API Key</h1>
      <form onSubmit={onSubmit} class={styles.form}>
        <Textbox
          onInput={onChangeKey}
          value={key}
          variant="border"
          style={{ width: '320px' }}
        />
        <Button type="submit" disabled={key?.length === 0}>
          Save
        </Button>
      </form>

      <div class={styles.texts}>
        <div class={styles.note}>
          <p>
            This Plugin is build using code in this repository, and won't use
            the key something malicious👍
          </p>
          <a href="https://github.com/kazuyaseki/figma-code-transformer">
            GitHub - figma-code-transformer
          </a>
        </div>
        <p class={styles.alert}>
          Disclaimer: This plugin may not produce satisfying result without
          GPT-4 model
        </p>
      </div>
    </div>
  );
};
