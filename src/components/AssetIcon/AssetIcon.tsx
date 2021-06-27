import React from 'react';
import SWAP_ASSET from '../../enum/SWAP_ASSET';
import lbtcImage from '../../images/liquid_btc.png';
import usdtImage from '../../images/usdt.png';

type Props = {
  symbol: SWAP_ASSET;
};

export const AssetIcon: React.FC<Props> = ({ symbol }) => {
  switch (symbol) {
    case SWAP_ASSET.LBTC:
      return (
        <img className="pool-card-img" src={lbtcImage} alt={SWAP_ASSET.LBTC} />
      );

    case SWAP_ASSET.USDT:
    default:
      return (
        <img className="pool-card-img" src={usdtImage} alt={SWAP_ASSET.USDT} />
      );
  }
};
