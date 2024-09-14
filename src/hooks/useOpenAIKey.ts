import { useCallback, useEffect, useState } from 'preact/hooks';
import { config } from '../fct.config';
import { UiToPluginMessage } from '../messaging';

export const useOpenAIKey = ({ url, apikey }: { url: string; apikey: string }) => {
  const [key, setKey] = useState(process.env.OPENAI_API_KEY || '');
  const [aoiUrl, setAoiUrl] = useState(process.env.AZUREAOI_URL || '');
  const [shouldSetKey, setShouldSetKey] = useState(
    !!config.buildForCommunityPlugin
  );
  useEffect(() => {
    if (shouldSetKey) {
      url && setAoiUrl(url);
      apikey && setKey(apikey);
      if (url && apikey) {
        setShouldSetKey(false);
      }
    }
  }, [url, apikey]);

  const onSetKey = useCallback((aoiUrl: string, key: string) => {
    const msg: UiToPluginMessage = {
      type: 'save-openai-key',
      aoiUrl: aoiUrl,
      openAiKey: key,
    };
    parent.postMessage({ pluginMessage: msg }, '*');

    setKey(key);
    setShouldSetKey(false);
  }, []);

  return {
    aoiUrl,
    key,
    onSetKey,
    shouldSetKey,
  };
};
