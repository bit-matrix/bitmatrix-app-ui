import SWAP_ASSET from '../enum/SWAP_ASSET';

export type PoolData = {
  rank: number;
  quoteSymbol: SWAP_ASSET;
  tokenSymbol: SWAP_ASSET;
  lpFeeRate: number;
  total_volume: number;
  volume_24h: number;
  fees_24h: number;
};
