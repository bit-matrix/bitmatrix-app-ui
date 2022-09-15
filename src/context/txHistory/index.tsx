import { ComponentProps, createContext, FC, ReactNode, useContext, useReducer } from 'react';
import { CommitmentStore } from '../../model/CommitmentStore';
import { setTxHistoryAction } from './actions';
import { initialTxHistoryState, txHistoryReducer } from './reducer';
import { ITxHistoryContext } from './types';

type Props = {
  children: ReactNode;
};

type CP = ComponentProps<FC> & Props;

const TxHistoryContext = createContext<ITxHistoryContext>({} as ITxHistoryContext);

export const useTxHistoryContext = (): ITxHistoryContext => useContext(TxHistoryContext);

export const TxHistoryContextProvider: React.FC<Props> = ({ children }: CP): JSX.Element => {
  const [txHistoryContext, dispatch] = useReducer(txHistoryReducer, initialTxHistoryState);

  const setTxHistoryContext = (txHistory: CommitmentStore[]): void => {
    setTxHistoryAction(txHistory, dispatch);
  };

  return (
    <TxHistoryContext.Provider value={{ txHistoryContext, setTxHistoryContext }}>{children}</TxHistoryContext.Provider>
  );
};
