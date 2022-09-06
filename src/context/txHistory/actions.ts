import { CommitmentStore } from '../../model/CommitmentStore';
import { SetTxHistoryAction, SET_TX_HISTORY } from './types';

export const setTxHistoryAction = (
  txHistory: CommitmentStore[],
  dispatch: (action: SetTxHistoryAction) => void,
): void => {
  dispatch({
    type: SET_TX_HISTORY,
    payload: txHistory,
  });
};
