import { Pool } from '@bitmatrix/models';

export type AppState = {
  pools?: Pool[];
  poolsLoading: boolean;
  isConnected: boolean;
};
