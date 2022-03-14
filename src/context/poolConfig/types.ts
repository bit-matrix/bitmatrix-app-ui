import { BmConfig } from '@bitmatrix/models';

export const SET_POOL_CONFIG = 'SET_POOL_CONFIG';

export type SetPoolConfigAction = {
  type: typeof SET_POOL_CONFIG;
  payload: BmConfig;
};

export interface IPoolConfigContext {
  poolConfigContext: BmConfig;
  setPoolConfig: (config: BmConfig) => void;
}
