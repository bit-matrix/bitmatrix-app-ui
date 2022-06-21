import { Pool } from '@bitmatrix/models';

export type AppState = {
  appLoading: boolean;
  pools: Pool[];
  isConnected: boolean;
};
