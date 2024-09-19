import { VerticalSpace } from '@create-figma-plugin/ui';
import { h } from 'preact';
import styles from './styles.css';

export const GenerationLoader = () => {

  return (
    <div class={styles.container}>
      <p class={styles.text}>
        ChatGPT is generating code. It may take about 40 to 120 seconds
      </p>
      <VerticalSpace space="small" />
      <div class={styles.loading}>
        <div class={styles.loadingItem}></div>
        <div class={styles.loadingItem}></div>
        <div class={styles.loadingItem}></div>
      </div>
    </div>
  );
};
