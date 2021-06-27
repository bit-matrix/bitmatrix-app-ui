import React from 'react';
import lbtcImage from '../../images/liquid_btc.png';
import usdtImage from '../../images/usdt.png';
import './PoolCard.scss';

export const PoolCard = () => {
  return (
    <div className="pool-card-main">
      <div className="pool-card-item column-1">
        <div className="column-1-item order-item">#1</div>
        <div className="column-1-item">
          <img className="pool-card-img" src={lbtcImage} alt="l-btc" />
          <img className="pool-card-img" src={usdtImage} alt="usd-t" />
        </div>
        <div className="column-1-item">USDT/L-BTC</div>
        <div className="column-1-item percent">0.3%</div>
      </div>
      <div className="pool-card-item column-2">
        <tr>
          <th>TVL</th>
          <th>Volume 24h</th>
          <th>Fees 24h</th>
        </tr>
        <tr>
          <td>$357.77m</td>
          <td>$219.20m</td>
          <td>$657.61k</td>
        </tr>
      </div>
    </div>
  );
};
