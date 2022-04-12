import { Pool } from '@bitmatrix/models';
import { Reducer } from 'react';
import { deepCopy } from '../../helper';
import { SetPoolsAction, SET_POOLS } from './types';

export const poolsReducer: Reducer<Pool[], SetPoolsAction> = (state: Pool[], action: SetPoolsAction): Pool[] => {
  switch (action.type) {
    case SET_POOLS:
      const pools = deepCopy(action.payload);
      return pools;

    default:
      return state;
  }
};
