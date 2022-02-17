import { BmConfig } from '@bitmatrix/models';

export const SET_POOL_CONFIG = 'SET_POOL_CONFIG';

export interface SetPoolConfigAction {
  type: typeof SET_POOL_CONFIG;
  payload: BmConfig;
}

export interface IPoolConfigContext {
  poolConfig: BmConfig;
  setPoolConfig: (config: BmConfig) => void;
}