import {
  Container,
  LoadingIndicator,
  VerticalSpace,
} from '@create-figma-plugin/ui';
import { h, Fragment } from 'preact';
import { useRef } from 'react';
import { PLUGIN_WINDOW_WIDTH_PX } from '../../constants';
import { config } from '../../fct.config';
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
        OpenAI API is generating code. It may take about 40 to 120 seconds.
        {config.showCatMovieWhileWaiting ? (
          <>
            <br />
            Please watch a cat video while you wait.
          </>
        ) : (
          ''
        )}
      </p>
      <VerticalSpace space="small" />
      {config.showCatMovieWhileWaiting ? (
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
      ) : (
        <Container space="extraLarge">
          <VerticalSpace space="extraLarge" />
          <LoadingIndicator />
        </Container>
      )}
    </div>
  );
};
