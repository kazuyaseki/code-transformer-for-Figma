import { VerticalSpace } from '@create-figma-plugin/ui';
import { h } from 'preact';
import { useRef } from 'react';
import { PLUGIN_WINDOW_WIDTH_PX } from '../../constants';
import styles from './styles.css';

const CAT_VIDEO_URLS = [
  'https://www.youtube.com/embed/P645DPEKAo0',
  'https://www.youtube.com/embed/M5PbLfVGOQs',
  'https://www.youtube.com/embed/OMx213fS1yc',
  'https://www.youtube.com/embed/v4atuiyJd7Y',
  'https://www.youtube.com/embed/czkfKyXbKvg',
  'https://www.youtube.com/embed/dlY0mSI_WZc',
  'https://www.youtube.com/embed/BZwFz7oJSGY',
  'https://www.youtube.com/embed/8iTTtg9NbSY',
  'https://www.youtube.com/embed/rnHPPgFhwjs',
  'https://www.youtube.com/embed/Qcdx5xX3gW0',
  'https://www.youtube.com/embed/hKcHhwOiPOo',
];

function randomlySelectCatVideoUrl() {
  return CAT_VIDEO_URLS[Math.floor(Math.random() * CAT_VIDEO_URLS.length)];
}

export const GenerationLoader = () => {
  const catVideoUrl = useRef(randomlySelectCatVideoUrl() + '?autoplay=1');

  return (
    <div class={styles.container}>
      <p class={styles.text}>
        ChatGPT さんが頑張ってコードを生成しています。
        <br />
        猫動画でもみながらお待ちください。(およそ40秒ほど)
      </p>
      <VerticalSpace space="small" />
      <div>
        <iframe
          width={PLUGIN_WINDOW_WIDTH_PX - 40}
          height={(PLUGIN_WINDOW_WIDTH_PX - 40) * (9 / 16)}
          src={catVideoUrl.current}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          autoPlay
        ></iframe>
        <p class={styles.creditsText}>Credits: 感動猫動画</p>
      </div>
    </div>
  );
};
