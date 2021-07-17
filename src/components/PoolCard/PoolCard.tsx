import React from 'react';
import { PoolData } from '../../model/PoolData';
import { AssetIcon } from '../AssetIcon/AssetIcon';
import Numeral from 'numeral';
import './PoolCard.scss';

type Props = {
  data: PoolData;
  onClick: () => void;
};

export const PoolCard: React.FC<Props> = ({ data, onClick }) => {
  return (
    <div className="pool-card-main" onClick={onClick}>
      <div className="pool-card-item column-1">
        <div className="column-1-item order-item">#{data.rank}</div>
        <div className="column-1-item ">
          <AssetIcon symbol={data.fromSymbol} />
          <AssetIcon symbol={data.toSymbol} />
        </div>
        <div className="column-1-item token-item">
          {data.fromSymbol}/{data.toSymbol}
        </div>
        <div className="column-1-item percent">{data.rate}%</div>
      </div>

      <div className="pool-card-item column-2 mobile-hidden">
        <tr>
          <th>TVL</th>
          <th>Volume 24h</th>
          <th>Fees 24h</th>
        </tr>
        <tr>
          <td>${Numeral(data.total_volume).format('(0.00a)')}</td>
          <td>${Numeral(data.volume_24h).format('(0.00a)')}</td>
          <td>${Numeral(data.fees_24h).format('(0.00a)')}</td>
        </tr>
      </div>
    </div>
  );
};
