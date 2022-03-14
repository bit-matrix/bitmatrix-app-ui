import { Pool } from '@bitmatrix/models';
import { Reducer } from 'react';
import { SetPoolsAction, SET_POOLS } from './types';

export const poolsReducer: Reducer<Pool[], SetPoolsAction> = (state: Pool[], action: SetPoolsAction): Pool[] => {
  switch (action.type) {
    case SET_POOLS:
      if (state.length > 0) {
        const pools = [...state];
        const newPools = action.payload;
        const difference = pools.filter(({ id: id1 }) => !newPools.some(({ id: id2 }) => id2 === id1));
        const newState = pools.concat(difference);
        return newState;
      } else {
        return [...action.payload];
      }
    default:
      return state;
  }
};
