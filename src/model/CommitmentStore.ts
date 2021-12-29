export type CommitmentStore = {
  txId: string;
  toAmount: number;
  fromAmount: number;
  toAsset: string;
  fromAsset: string;
  timestamp: number;
  success: boolean;
  completed: boolean;
  seen: boolean;
};
