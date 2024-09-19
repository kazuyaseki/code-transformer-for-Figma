import { useReducer } from 'preact/hooks';

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

  return {
    compareHtml: state.compareHtml,
    compareCss: state.compareCss,
    comparePrompt: state.comparePrompt,
    compareResult: state.compareResult,
    setCompareHtml: (compareHtml: string) => dispatch({ type: 'setCompareHtml', compareHtml }),
    setCompareCss: (compareCss: string) => dispatch({ type: 'setCompareCss', compareCss }),
    setComparePrompt: (comparePrompt: string) => dispatch({ type: 'setComparePrompt', comparePrompt }),
    generateResult: (compareResult: string) => dispatch({ type: 'generateResult', compareResult }),
  };
};
