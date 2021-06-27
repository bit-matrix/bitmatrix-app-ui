import SWAP_ASSET from '../enum/SWAP_ASSET';

export type PoolData = {
  rank: number;
  toSymbol: SWAP_ASSET;
  fromSymbol: SWAP_ASSET;
  rate: number;
  total_volume: number;
  volume_24h: number;
  fees_24h: number;
};
