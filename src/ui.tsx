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
  const { key: openAIAPIKey, shouldSetKey, onSetKey } = useOpenAIKey();

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
    frontendLibrary,
    onChangeFrontendLibrary,
  } = useFigmaLayerData(openAIAPIKey);

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
        createChatCompletion(openAIAPIKey, prompt, []),
        ...chunkPrompts.map((chunkPrompt) => {
          return createChatCompletion(openAIAPIKey, chunkPrompt, []);
        }),
      ]);

      const rootCode = integrateChunkCodes(
        codes[0],
        chunks.map((chunk, index) => ({
          id: 'id' in chunk ? chunk.id || '' : '',
          code: codes[index],
        }))
      );

      const promptForPrInfo =
        buildPromptForSuggestingBranchNameCommitMessagePrTitle(rootCode);
      const prInfoStr = await createChatCompletion(
        openAIAPIKey,
        promptForPrInfo,
        [],
        true
      );
      const prInfo = JSON.parse(prInfoStr) as PrInfo;

      const promptForStory = buildPromptForStorybook(
        rootCode,
        prInfo.componentName
      );
      const story = await createChatCompletion(
        openAIAPIKey,
        promptForStory,
        [],
        true
      );

      setLoading(false);

      setCode(rootCode);
      setStory(story);

      setAll(prInfo);
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

  const generatePR = async () => {
    if (!selectedDirectory) return;

    const result = await createBranchAndPRWithMultipleFiles(
      process.env.REPOSITORY_OWNER || '',
      process.env.REPOSITORY_NAME || '',
      branchName,
      prTitle,
      commitMessage,
      [
        {
          path: `${selectedDirectory.value}/${componentName}.tsx`,
          content: code || '',
        },
        {
          path: `${selectedDirectory.value}/${componentName}.stories.tsx`,
          content: story || '',
        },
      ]
    );

    if (result) {
      openPRInBrowser(result.data.html_url);
    }
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
      }
    };
  }, []);

  if (shouldSetKey) {
    return <SetOpenAIKeyScreen onSetKey={onSetKey} />;
  }

  if (loading) {
    return <GenerationLoader />;
  }

  if (code === null || story === null) {
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
        frontendLibrary={frontendLibrary}
        onChangeFrontendLibrary={onChangeFrontendLibrary}
      />
    );
  }

  return (
    <CodeEditor
      branchName={branchName}
      code={code}
      story={story}
      setStory={setStory}
      commitMessage={commitMessage}
      generatePR={generatePR}
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
