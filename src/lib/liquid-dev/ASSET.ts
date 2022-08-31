import SWAP_ASSET from '../../enum/SWAP_ASSET';
import { PAsset } from '@bitmatrix/models';

export const lbtcAsset: PAsset = {
  assetHash: '144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49',
  name: 'Liquid Bitcoin',
  precision: 8,
  ticker: SWAP_ASSET.LBTC,
  isQuote: true,
  value: '',
};
