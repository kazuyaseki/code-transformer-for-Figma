import { useReducer } from 'preact/hooks';
import { SelectOption } from '../ui/CodeEditor';

export type PrInfo = {
  branchName: string;
  commitMessage: string;
  prTitle: string;
  componentName: string;
  selectedDirectory: SelectOption | null;
};

type State = PrInfo;

const initialState: State = {
  branchName: '',
  commitMessage: '',
  prTitle: '',
  componentName: '',
  selectedDirectory: null,
};

type Action =
  | {
      type: 'setAll';
      prInfo: PrInfo;
    }
  | {
      type: 'setBranchName';
      branchName: string;
    }
  | {
      type: 'setCommitMessage';
      commitMessage: string;
    }
  | {
      type: 'setPrTitle';
      prTitle: string;
    }
  | {
      type: 'setComponentName';
      componentName: string;
    }
  | {
      type: 'setSelectedDirectory';
      selectedDirectory: SelectOption | null;
    };

export const usePrInfo = () => {
  const reducer = (state: State, action: Action) => {
    switch (action.type) {
      case 'setAll':
        return action.prInfo;
      case 'setBranchName':
        return { ...state, branchName: action.branchName };
      case 'setCommitMessage':
        return { ...state, commitMessage: action.commitMessage };
      case 'setPrTitle':
        return { ...state, prTitle: action.prTitle };
      case 'setComponentName':
        return { ...state, componentName: action.componentName };
      case 'setSelectedDirectory':
        return { ...state, selectedDirectory: action.selectedDirectory };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return {
    branchName: state.branchName,
    commitMessage: state.commitMessage,
    prTitle: state.prTitle,
    componentName: state.componentName,
    selectedDirectory: state.selectedDirectory,
    setAll: (prInfo: PrInfo) =>
      dispatch({
        type: 'setAll',
        prInfo,
      }),
    setBranchName: (branchName: string) =>
      dispatch({ type: 'setBranchName', branchName }),
    setCommitMessage: (commitMessage: string) =>
      dispatch({ type: 'setCommitMessage', commitMessage }),
    setPrTitle: (prTitle: string) => dispatch({ type: 'setPrTitle', prTitle }),
    setComponentName: (componentName: string) =>
      dispatch({ type: 'setComponentName', componentName }),
    setSelectedDirectory(selectedDirectory: SelectOption | null) {
      dispatch({ type: 'setSelectedDirectory', selectedDirectory });
    },
  };
};
