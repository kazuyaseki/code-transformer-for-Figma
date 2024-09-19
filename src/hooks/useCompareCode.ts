import { useReducer } from 'preact/hooks';

type State = {
  compareHtml: string | null;
  compareCss: string | null;
  comparePrompt: string | null;
};

const initialState: State = {
    compareHtml: null,
    compareCss: null,
    comparePrompt: null
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
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return {
    compareHtml: state.compareHtml,
    compareCss: state.compareCss,
    comparePrompt: state.comparePrompt,
    setCompareHtml: (compareHtml: string) => dispatch({ type: 'setCompareHtml', compareHtml }),
    setCompareCss: (compareCss: string) => dispatch({ type: 'setCompareCss', compareCss }),
    setComparePrompt: (comparePrompt: string) => dispatch({ type: 'setComparePrompt', comparePrompt }),
  };
};
