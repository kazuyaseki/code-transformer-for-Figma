import { useCallback, useEffect, useState } from 'preact/hooks';
import { config } from '../fct.config';
import { PluginToUiMessage, UiToPluginMessage } from '../messaging';

const STORAGE_KEY = 'OPANAI_API_KEY';

export const useOpenAIKey = () => {
  const [key, setKey] = useState(process.env.OPENAI_API_KEY || '');
  const [shouldSetKey, setShouldSetKey] = useState(
    !!config.buildForCommunityPlugin
  );

  useEffect(() => {
    onmessage = async (event: {
      data: {
        pluginMessage: PluginToUiMessage;
      };
    }) => {
      const pluginMessage = event.data.pluginMessage;

      if (!pluginMessage) return;

      if (pluginMessage.type === 'get-openai-key') {
        if (shouldSetKey) {
          const storedKey = pluginMessage.openAiKey;
          if (storedKey) {
            setKey(storedKey);
            setShouldSetKey(false);
          }
        }
      }
    };
  }, []);

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
  };
};
