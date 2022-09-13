import { CALL_METHOD } from '@bitmatrix/models';
import { AssetModel } from '../helper';
import { TX_STATUS } from '@bitmatrix/models';

export type CommitmentStore = {
  txId: string;
  tokenAmount: number;
  tokenAsset: AssetModel;
  quoteAmount: number;
  quoteAsset: AssetModel;
  lpAmount?: number;
  lpAsset?: string;
  timestamp: number;
  completed: boolean;
  seen: boolean;
  method: CALL_METHOD;
  poolTxId?: string;
  errorMessage?: string;
  txStatus?: TX_STATUS;
};
