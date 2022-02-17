import { Pool } from '@bitmatrix/models';

export const SET_POOLS = 'SET_POOLS';

export interface SetPoolsAction {
  type: typeof SET_POOLS;
  payload: Pool[];
}

export interface IPoolContext {
  pools: Pool[];
  setPools: (pools: Pool[]) => void;
}
