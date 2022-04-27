import React from 'react';
import { TESTNET_ASSET_ID } from '../../lib/liquid-dev/ASSET_ID';
import { Asset } from '../../model/Asset';
import LbtcIcon from '../base/Svg/Icons/Lbtc';
import TetherIcon from '../base/Svg/Icons/Tether';
import UnknownIcon from '../base/Svg/Icons/Unknown';

type Props = {
  asset: Asset;
};

export const AssetIcon: React.FC<Props> = ({ asset }) => {
  switch (asset.assetHash) {
    case TESTNET_ASSET_ID.LBTC:
      return <LbtcIcon width="1.75rem" height="1.75rem" />;

    case TESTNET_ASSET_ID.USDT:
      return <TetherIcon width="1.75rem" height="1.75rem" />;

    default:
      return <UnknownIcon width="1.75rem" height="1.75rem" />;
  }
};
