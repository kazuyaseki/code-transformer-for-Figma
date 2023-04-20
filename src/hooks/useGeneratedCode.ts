import { useReducer } from 'preact/hooks';

type State = {
  code: string | null;
  story: string | null;
};

const initialState: State = {
  code: null,
  story: null,
};

type Action =
  | {
      type: 'setCode';
      code: string;
    }
  | {
      type: 'setStory';
      story: string;
    };

export const useGeneratedCode = () => {
  const reducer = (state: State, action: Action) => {
    switch (action.type) {
      case 'setCode':
        return { ...state, code: action.code };
      case 'setStory':
        return { ...state, story: action.story };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return {
    code: state.code,
    story: state.story,
    setCode: (code: string) => dispatch({ type: 'setCode', code }),
    setStory: (story: string) => dispatch({ type: 'setStory', story }),
  };
};
