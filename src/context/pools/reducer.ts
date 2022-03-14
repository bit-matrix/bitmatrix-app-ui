import { Pool } from '@bitmatrix/models';
import { Reducer } from 'react';
import { SetPoolsAction, SET_POOLS } from './types';

export const poolsReducer: Reducer<Pool[], SetPoolsAction> = (state: Pool[], action: SetPoolsAction): Pool[] => {
  switch (action.type) {
    case SET_POOLS:
      const newState = [...action.payload];
      return newState;

    default:
      return state;
  }
};
