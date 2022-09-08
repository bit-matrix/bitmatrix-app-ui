/* eslint-disable react-hooks/rules-of-hooks */
import { Reducer } from 'react';
import { deepCopy } from '../../helper';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { CommitmentStore } from '../../model/CommitmentStore';
import { SetTxHistoryAction, SET_TX_HISTORY } from './types';

const { getLocalData, setLocalData } = useLocalStorage<CommitmentStore[]>('BmTxV6');
const localHistoryData: CommitmentStore[] | undefined = getLocalData();
const history: CommitmentStore[] | undefined = deepCopy(localHistoryData || []);

export const initialTxHistoryState: CommitmentStore[] = history;

export const txHistoryReducer: Reducer<CommitmentStore[], SetTxHistoryAction> = (
  state: CommitmentStore[] = initialTxHistoryState,
  action: SetTxHistoryAction,
): CommitmentStore[] => {
  switch (action.type) {
    case SET_TX_HISTORY:
      const txHistory = action.payload;
      setLocalData(txHistory);
      return txHistory;

    default:
      return state;
  }
};
