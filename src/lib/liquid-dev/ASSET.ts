import SWAP_ASSET from '../../enum/SWAP_ASSET';
import { LBTC_ASSET } from '../../env';
import { AssetModel } from '../../helper';

export const lbtcAsset: AssetModel = {
  hash: LBTC_ASSET,
  name: 'Liquid Bitcoin',
  ticker: SWAP_ASSET.LBTC,
};
