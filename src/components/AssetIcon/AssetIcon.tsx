import React from 'react';

import LbtcIcon from '../base/Svg/Icons/Lbtc';
import TetherIcon from '../base/Svg/Icons/Tether';
import UnknownIcon from '../base/Svg/Icons/Unknown';
import fusd from '../../images/fusd.png';
import lcad from '../../images/lcadicon.png';
import { pair1AssetList } from '../../helper';

type Props = {
  asset: string;
  width?: string;
  height?: string;
  className?: string;
};

export const AssetIcon: React.FC<Props> = ({ asset, className, width = '1.75rem', height = '1.75rem' }) => {
  switch (asset) {
    case pair1AssetList[0]:
      return <LbtcIcon className={className} width={width} height={height} />;

    case pair1AssetList[1]:
      return <TetherIcon className={className} width={width} height={height} />;

    case pair1AssetList[2]:
      return <img src={lcad} alt="" className={className} style={{ width, height, verticalAlign: 'unset' }} />;

    case pair1AssetList[3]:
      return <img src={fusd} alt="" className={className} style={{ width, height, verticalAlign: 'unset' }} />;

    default:
      return <UnknownIcon className={className} width={width} height={height} />;
  }
};
