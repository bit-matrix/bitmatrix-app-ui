import { Pool } from '@bitmatrix/models';
import { SetPoolsAction, SET_POOLS } from './types';

export const initialPoolState: Pool = {
  id: '',
  quote: {
    ticker: '',
    name: '',
    asset: '',
    value: '',
  },
  token: {
    ticker: '',
    name: '',
    asset: '',
    value: '',
  },
  lp: {
    ticker: '',
    name: '',
    asset: '',
    value: '',
  },
  initialTx: {
    block_hash: '',
    block_height: 0,
    txid: '',
  },
  lastSyncedBlock: { block_hash: '', block_height: 0 },
  bestBlockHeight: 0,
  synced: false,
  unspentTx: {
    block_hash: '',
    block_height: 0,
    txid: '',
  },
  lastSentPtx: '',
  active: false,
};

export const poolsReducer = (state: Pool[], action: SetPoolsAction): Pool[] => {
  switch (action.type) {
    case SET_POOLS:
      return [...state, ...action.payload];

    default:
      return state;
  }
};
