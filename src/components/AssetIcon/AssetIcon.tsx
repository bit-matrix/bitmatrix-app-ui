import React from 'react';
import SWAP_ASSET from '../../enum/SWAP_ASSET';
import LbtcIcon from '../base/Svg/Icons/Lbtc';
import TetherIcon from '../base/Svg/Icons/Tether';

type Props = {
  symbol: SWAP_ASSET;
};

export const AssetIcon: React.FC<Props> = ({ symbol }) => {
  switch (symbol) {
    case SWAP_ASSET.LBTC:
      return <LbtcIcon width="1.75rem" height="1.75rem" />;

    case SWAP_ASSET.USDT:
    default:
      return <TetherIcon width="1.75rem" height="1.75rem" />;
  }
};
