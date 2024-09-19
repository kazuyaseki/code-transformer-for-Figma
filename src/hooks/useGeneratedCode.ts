import { useReducer } from 'preact/hooks';

type State = {
  htmlCode: string | null;
  cssCode: string | null;
};

const initialState: State = {
  htmlCode: null,
  cssCode: null,
};

type Action =
  | {
      type: 'setHtml';
      htmlCode: string;
    }
  | {
      type: 'setCSS';
      cssCode: string;
    };

export const useGeneratedCode = () => {
  const reducer = (state: State, action: Action) => {
    switch (action.type) {
      case 'setHtml':
        return { ...state, htmlCode: action.htmlCode };
      case 'setCSS':
        return { ...state, cssCode: action.cssCode };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return {
    htmlCode: state.htmlCode,
    cssCode: state.cssCode,
    setHtml: (htmlCode: string) => dispatch({ type: 'setHtml', htmlCode }),
    setCSS: (cssCode: string) => dispatch({ type: 'setCSS', cssCode }),
  };
};
