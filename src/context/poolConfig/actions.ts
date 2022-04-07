import { BmConfig } from '@bitmatrix/models';
import { SetPoolConfigAction, SET_POOL_CONFIG } from './types';

export const setPoolConfigAction = (config: BmConfig, dispatch: (action: SetPoolConfigAction) => void): void => {
  dispatch({
    type: SET_POOL_CONFIG,
    payload: config,
  });
};
