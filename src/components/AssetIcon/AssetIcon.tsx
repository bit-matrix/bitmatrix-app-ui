import React from 'react';
import { TESTNET_ASSET_ID } from '../../lib/liquid-dev/ASSET_ID';
import { Asset } from '../../model/Asset';
import LbtcIcon from '../base/Svg/Icons/Lbtc';
import TetherIcon from '../base/Svg/Icons/Tether';
import UnknownIcon from '../base/Svg/Icons/Unknown';

type Props = {
  asset: Asset;
  width?: string;
  height?: string;
  className?: string;
};

export const AssetIcon: React.FC<Props> = ({ asset, className, width = '1.75rem', height = '1.75rem' }) => {
  switch (asset.assetHash) {
    case TESTNET_ASSET_ID.LBTC:
      return <LbtcIcon className={className} width={width} height={height} />;

    case TESTNET_ASSET_ID.USDT:
      return <TetherIcon className={className} width={width} height={height} />;

    default:
      return <UnknownIcon className={className} width={width} height={height} />;
  }
};
