import { useCallback, useEffect, useState } from 'preact/hooks';
import { config } from '../fct.config';
import { PluginToUiMessage, UiToPluginMessage } from '../messaging';

const STORAGE_KEY = 'OPANAI_API_KEY';

export const useOpenAIKey = () => {
  const [key, setKey] = useState(process.env.OPENAI_API_KEY || '');
  const [shouldSetKey, setShouldSetKey] = useState(
    !!config.buildForCommunityPlugin
  );

  const restoreAPIKeyFromStorage = (storedKey: string) => {
    setKey(storedKey);
    setShouldSetKey(false);
  };

  const onSetKey = useCallback((key: string) => {
    const msg: UiToPluginMessage = {
      type: 'save-openai-key',
      openAiKey: key,
    };
    parent.postMessage({ pluginMessage: msg }, '*');

    setKey(key);
    setShouldSetKey(false);
  }, []);

  return {
    key,
    onSetKey,
    shouldSetKey,
    restoreAPIKeyFromStorage,
  };
};
