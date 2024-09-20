import { useReducer, useState } from 'preact/hooks';
import { buildPromptForComparingCode } from '../chatGPT/buildPrompt';
import { PluginToUiMessage } from '../messaging';

type State = {
  compareHtml: string | null;
  compareCss: string | null;
  comparePrompt: string | null;
  compareResult: string | null;
};

const initialState: State = {
    compareHtml: null,
    compareCss: null,
    comparePrompt: null,
    compareResult: null
};

type Action =
    | {
        type: 'setCompareHtml';
        compareHtml: string;
    }
    | {
        type: 'setCompareCss';
        compareCss: string;
    }
    | {
        type: 'setComparePrompt';
        comparePrompt: string;
    }
    | {
        type: 'generateResult';
        compareResult: string;
    };

export const useCompareCode = () => {
  const reducer = (state: State, action: Action) => {
    switch (action.type) {
      case 'setCompareHtml':
        return { ...state, compareHtml: action.compareHtml };
      case 'setCompareCss':
        return { ...state, compareCss: action.compareCss };
      case 'setComparePrompt':
          return { ...state, comparePrompt: action.comparePrompt };
      case 'generateResult':
          return { ...state, compareResult: action.compareResult };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const [json, setFigmaJson] = useState<string>('');
  const [promptData, setPrompt] = useState<string>('');
  const replacer = (key: any, value: any) => {
    if (value === null || value === undefined || (Array.isArray(value) && value.length == 0)) {
      return undefined;
    }
    return value;
  }

  const initJsonData = async (pluginMessage: PluginToUiMessage) => {
    if (pluginMessage.type !== 'sendSelectedNode') return;
    const {
      nodeJSON,
      chunks: _chunks,
    } = pluginMessage;

    const json = JSON.stringify(nodeJSON, replacer);
    setFigmaJson(json);
    console.log("figma json:" + json);
  };

  const initPromptData = (json: string) => {
    const res = buildPromptForComparingCode(
      json,
      state.compareHtml || "",
      state.compareCss || ""
    );
    setPrompt(res);
  };

  return {
    compareHtml: state.compareHtml,
    compareCss: state.compareCss,
    comparePrompt: promptData,
    compareResult: state.compareResult,
    setCompareHtml: (compareHtml: string) => dispatch({ type: 'setCompareHtml', compareHtml }),
    setCompareCss: (compareCss: string) => dispatch({ type: 'setCompareCss', compareCss }),
    setComparePrompt: (comparePrompt: string) => dispatch({ type: 'setComparePrompt', comparePrompt }),
    generateResult: (compareResult: string) => dispatch({ type: 'generateResult', compareResult }),
    initJsonData,
    initPromptData,
    figmaJson: json
  };
};
