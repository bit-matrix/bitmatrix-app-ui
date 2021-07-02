import React from 'react';
import { Icon } from 'rsuite';
import { Loading } from '../Loading/Loading';
import './InfoCard.scss';

export const InfoCard: React.FC = () => {
  return (
    <div className="info-card-main">
      <div className="info-card-content">
        <div className="info-card-item">
          <Icon className="info-card-item-icon" icon="exchange" />
          <div>Swap 0.075 L-BTC for 2675.70 USDT</div>
          <Loading width="1.5rem" height="1.5rem" />
        </div>
        <div className="info-card-item">
          <Icon className="info-card-item-icon" icon="tint" />
          <div>Add 1.58 L-BTC and 56,369.15 USDT</div>
          <div>4h</div>
        </div>
        <div className="info-card-item">
          <Icon className="info-card-item-icon" icon="exchange" />
          <div>Swap 1255.20 USDT for 0.035 L-BTC</div>
          <div>2d</div>
        </div>
      </div>
      <div className="info-card-footer">No other record found.</div>
    </div>
  );
};
