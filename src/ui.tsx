import { render } from '@create-figma-plugin/ui';
import { h } from 'preact';
import { useState } from 'preact/hooks';
import { useEffect } from 'react';
import {
  buildPromptForGeneratingCodeForChunk,
  buildPromptForStorybook,
  buildPromptForSuggestingBranchNameCommitMessagePrTitle,
} from './chatGPT/buildPrompt';
import { createChatCompletion } from './chatGPT/createChatCompletion';
import {
  createBranchAndPRWithMultipleFiles,
  openPRInBrowser,
} from './github/createBranchAndPRWithMultipleFiles';
import { useFigmaLayerData } from './hooks/useFigmaLayerData';
import { useGeneratedCode } from './hooks/useGeneratedCode';
import { useOpenAIKey } from './hooks/useOpenAIKey';
import { PrInfo, usePrInfo } from './hooks/usePrInfo';
import { useRepositoryDirectoryNames } from './hooks/useRepositoryDirectoryNames';
import { PluginToUiMessage, UiToPluginMessage } from './messaging';

import { CodeEditor } from './ui/CodeEditor';
import { GenerationLoader } from './ui/GenerationLoader';
import { Home } from './ui/Home';
import { SetOpenAIKeyScreen } from './ui/SetOpenAIKeyScreen';
import { integrateChunkCodes } from './utils/integrateChunkCodes';

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

  const { code, story, setCode, setStory } = useGeneratedCode();
  const {
    branchName,
    commitMessage,
    prTitle,
    componentName,
    selectedDirectory,
    setAll,
    setBranchName,
    setCommitMessage,
    setPrTitle,
    setSelectedDirectory,
  } = usePrInfo();

  const { directoryNames } = useRepositoryDirectoryNames();

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

      const rootCode = integrateChunkCodes(
        codes[0],
        chunks.map((chunk, index) => ({
          id: 'id' in chunk ? chunk.id || '' : '',
          code: codes[index],
        }))
      );
      /*
      const promptForPrInfo =
        buildPromptForSuggestingBranchNameCommitMessagePrTitle(rootCode);
      const prInfoStr = await createChatCompletion(
        aoiUrl,
        openAIAPIKey,
        promptForPrInfo,
        []
      );
      const prInfo = JSON.parse(prInfoStr) as PrInfo;

      const promptForStory = buildPromptForStorybook(
        rootCode,
        prInfo.componentName
      );
      const story = await createChatCompletion(
        aoiUrl,
        openAIAPIKey,
        promptForStory,
        []
      );
    */
      setLoading(false);

      setCode(rootCode);
      //setStory(story);

      //setAll(prInfo);
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

  if (code === null) {
    return (
      <Home
        originalNodeTree={originalNode}
        setPrompt={setPrompt}
        prompt={prompt}
        generateCode={generateCode}
        nodeId={nodeId}
        query={gqlQuery}
        setQuery={setGqlQuery}
        childFragmentStrings={childFragmentStrings}
      />
    );
  }

  return (
    <CodeEditor
      branchName={branchName}
      code={code}
      story={story || ""}
      setStory={setStory}
      commitMessage={commitMessage}
      copyToClipboard={copyToClipboard}
      prTitle={prTitle}
      setCode={setCode}
      setCommitMessage={setCommitMessage}
      setPrTitle={setPrTitle}
      setBranchName={setBranchName}
      selectedDirectory={selectedDirectory}
      setSelectedDirectory={setSelectedDirectory}
      directoryNames={directoryNames}
    />
  );
}

export default render(Plugin);
