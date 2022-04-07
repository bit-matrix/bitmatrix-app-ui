import { Pool } from '@bitmatrix/models';
import { SetPoolsAction, SET_POOLS } from './types';

export const setPoolsAction = (pools: Pool[], dispatch: (action: SetPoolsAction) => void): void => {
  dispatch({
    type: SET_POOLS,
    payload: pools,
  });
};
