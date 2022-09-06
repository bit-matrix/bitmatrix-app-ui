import React from 'react';
import { TESTNET_ASSET_ID } from '../../lib/liquid-dev/ASSET_ID';

import LbtcIcon from '../base/Svg/Icons/Lbtc';
import TetherIcon from '../base/Svg/Icons/Tether';
import UnknownIcon from '../base/Svg/Icons/Unknown';
import fusd from '../../images/fusd.png';
import lcad from '../../images/lcadicon.png';

type Props = {
  asset: string;
  width?: string;
  height?: string;
  className?: string;
};

export const AssetIcon: React.FC<Props> = ({ asset, className, width = '1.75rem', height = '1.75rem' }) => {
  switch (asset) {
    case TESTNET_ASSET_ID.LBTC:
      return <LbtcIcon className={className} width={width} height={height} />;

    case TESTNET_ASSET_ID.USDT:
      return <TetherIcon className={className} width={width} height={height} />;

    case TESTNET_ASSET_ID.FUSD:
      return <img src={fusd} alt="" className={className} style={{ width, height, verticalAlign: 'unset' }} />;

    case TESTNET_ASSET_ID.CAD:
      return <img src={lcad} alt="" className={className} style={{ width, height, verticalAlign: 'unset' }} />;

    default:
      return <UnknownIcon className={className} width={width} height={height} />;
  }
};
