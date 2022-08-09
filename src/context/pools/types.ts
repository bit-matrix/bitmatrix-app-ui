import { Pool } from '@bitmatrix/models';

export const SET_POOLS = 'SET_POOLS';

export type SetPoolsAction = {
  type: typeof SET_POOLS;
  payload: Pool[];
};

export interface IPoolContext {
  pools: Pool[];
  setPoolsContext: (pools: Pool[]) => void;
}
