import SWAP_ASSET from '../enum/SWAP_ASSET';
import { ASSET_ID } from '../lib/liquid-dev/ASSET_ID';

type AssetAmount = {
  assetId: ASSET_ID;
  assetName: SWAP_ASSET;
  amount: number;
};

export default AssetAmount;
