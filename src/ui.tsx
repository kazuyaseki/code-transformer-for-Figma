import { render } from '@create-figma-plugin/ui';
import { h, JSX } from 'preact';
import { useState } from 'preact/hooks';
import { useEffect } from 'react';
import { Tabs } from '@create-figma-plugin/ui';
import { buildPromptForGeneratingCodeForChunk } from './chatGPT/buildPrompt';
import { createChatCompletion } from './chatGPT/createChatCompletion';
import { useFigmaLayerData } from './hooks/useFigmaLayerData';
import { useGeneratedCode } from './hooks/useGeneratedCode';
import { useCompareCode } from './hooks/useCompareCode';
import { useOpenAIKey } from './hooks/useOpenAIKey';
import { PluginToUiMessage, UiToPluginMessage } from './messaging';

import { GenerationLoader } from './ui/GenerationLoader';
import { SetOpenAIKeyScreen } from './ui/SetOpenAIKeyScreen';
import { integrateChunkCodes } from './utils/integrateChunkCodes';
import { CompareEditor } from './ui/CompareEditor';
import { PromptHome } from "./ui/PromptEditor/Prompt";

type TAB_VALUE = 'Design to Code' | 'Compare code with design';

function Plugin() {
  const [aoiUrlCache, setAoiUrlCache] = useState<string>('');
  const [apikeyCache, setApikeyCache] = useState<string>('');
  const { aoiUrl, key: openAIAPIKey, shouldSetKey, onSetKey } = useOpenAIKey({url: aoiUrlCache, apikey: apikeyCache});

  const {
    prompt,
    originalNode,
    nodeId,
    gqlQuery,
    childFragmentStrings,
    chunks,
    propsSummaries,
    setInitialData,
    setPrompt,
    setGqlQuery,
  } = useFigmaLayerData(aoiUrl, openAIAPIKey);

  const [loading, setLoading] = useState(false);
  const [showReult, setShowResult] = useState(false);

  const { htmlCode, cssCode, setHtml, setCSS } = useGeneratedCode();
  const { compareHtml, compareCss, comparePrompt, setCompareHtml, setCompareCss, setComparePrompt, generateResult, compareResult } = useCompareCode();

  const generateCode = async () => {
    setLoading(true);
    const chunkPrompts = chunks.map((chunk) => {
      return buildPromptForGeneratingCodeForChunk(
        JSON.stringify(chunk),
        propsSummaries
      );
    });

    try {
      const codes = await Promise.all([
        createChatCompletion(aoiUrl, openAIAPIKey, prompt, []),
        ...chunkPrompts.map((chunkPrompt) => {
          return createChatCompletion(aoiUrl, openAIAPIKey, chunkPrompt, []);
        }),
      ]);

      let gptResult = codes[0];
      const startIndex = gptResult.indexOf('{');
      gptResult = gptResult.slice(startIndex);
      const gptCode = JSON.parse(gptResult);
      
      const rootCode = integrateChunkCodes(
        gptCode['html'] || "",
        chunks.map((chunk, index) => ({
          id: 'id' in chunk ? chunk.id || '' : '',
          code: codes[index],
        }))
      );
      // TODO
      const cssCode = gptCode['css'] || "";
      setLoading(false);

      setHtml(rootCode);
      setCSS(cssCode);
      setShowResult(true)
    } catch (error: any) {
      console.log(error);
      const msg: UiToPluginMessage = {
        type: 'error-char-completion',
        error,
      };
      parent.postMessage({ pluginMessage: msg }, '*');
      setLoading(false);
    }
  };

  const compareCode = async () => {
    // TODO
    generateResult(compareResult || "compare results");
    setShowResult(true)
  }

  const copyToClipboard = (content: string) => {
    // copy content to clipboard
    const textArea = document.createElement('textarea');
    textArea.value = content;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  };

  useEffect(() => {
    onmessage = async (event: {
      data: {
        pluginMessage: PluginToUiMessage;
      };
    }) => {
      const pluginMessage = event.data.pluginMessage;
      if (!pluginMessage) return;
      if (pluginMessage.type === 'sendSelectedNode') {
        setInitialData(event.data.pluginMessage);
      } else if (pluginMessage.type === 'get-openai-key') {
        const storeAoiUrl = pluginMessage.aoiUrl;
        const storedKey = pluginMessage.openAiKey;
        setAoiUrlCache(storeAoiUrl || "");
        setApikeyCache(storedKey || "");
      }
    };
  }, []);

  if (shouldSetKey) {
    return <SetOpenAIKeyScreen onSetKey={onSetKey} />;
  }

  if (loading) {
    return <GenerationLoader />;
  }

  const [tabValue, setTabValue] = useState<TAB_VALUE>('Design to Code');

  const onChangeTab = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value as TAB_VALUE;
    setTabValue(newValue);
    setShowResult(false)
    setLoading(false);
  };

  const tabOptions = [
    {
      children: (
        <PromptHome
          nodeId={nodeId}
          query={gqlQuery}
          showReult={showReult}
          setQuery={setGqlQuery}
          childFragmentStrings={childFragmentStrings}
          originalNodeTree={originalNode}
          setPrompt={setPrompt}
          prompt={prompt}
          copyToClipboard={copyToClipboard}
          generateCode={generateCode}
          htmlCode={htmlCode || ""}
          cssCode={cssCode || ""}
          setCSS={setCSS}
          setHtml={setHtml}
        />
      ),
      value: 'Design to Code',
    },
    {
      children: (
        <CompareEditor
          showReult={showReult}
          htmlCode={compareHtml || ""}
          cssCode={compareCss || ""}
          setCSS={setCompareCss}
          compareResult={compareResult || ""}
          setHtml={setCompareHtml}
          setPrompt={setComparePrompt}
          prompt={prompt || ""}
          copyToClipboard={copyToClipboard}
          compareCode={compareCode}
        />
      ),
      value: 'Compare code with design',
    },
  ];

  return (
    <div>
      <Tabs
        onChange={onChangeTab}
        options={tabOptions}
        value={tabValue}
      />
    </div>
  );
}

export default render(Plugin);
