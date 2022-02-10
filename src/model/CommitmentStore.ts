import { CALL_METHOD } from '@bitmatrix/models';

export type CommitmentStore = {
  txId: string;
  tokenAmount: number;
  tokenAsset: string;
  quoteAmount: number;
  quoteAsset: string;
  lpAmount?: number;
  lpAsset?: string;
  timestamp: number;
  success: boolean;
  completed: boolean;
  seen: boolean;
  method: CALL_METHOD;
  poolTxId?: string;
};
