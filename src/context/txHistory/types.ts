import { CommitmentStore } from '../../model/CommitmentStore';

export const SET_TX_HISTORY = 'SET_TX_HISTORY';

export type SetTxHistoryAction = {
  type: typeof SET_TX_HISTORY;
  payload: CommitmentStore[];
};

export interface ITxHistoryContext {
  txHistoryContext: CommitmentStore[];
  setTxHistoryContext: (txHistory: CommitmentStore[]) => void;
}
