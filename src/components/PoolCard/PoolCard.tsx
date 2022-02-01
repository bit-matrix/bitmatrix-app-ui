import React from 'react';
import { AssetIcon } from '../AssetIcon/AssetIcon';
import Numeral from 'numeral';
import { Pool } from '@bitmatrix/models';
import SWAP_ASSET from '../../enum/SWAP_ASSET';
import { PREFERRED_UNIT_VALUE } from '../../enum/PREFERRED_UNIT_VALUE';
import { Tag } from 'rsuite';
import './PoolCard.scss';

type Props = {
  rank: number;
  pool: Pool;
  onClick: (poolId: string) => void;
  showDetail?: boolean;
};

export const PoolCard: React.FC<Props> = ({ pool, rank, onClick, showDetail = true }) => {
  return (
    <div className="pool-card-main" onClick={() => onClick(pool.id)}>
      <div className="pool-card-item column-1">
        <div className="column-1-item order-item">#{rank}</div>
        <div className="column-1-item ">
          <AssetIcon symbol={pool.quote.ticker as SWAP_ASSET} />
          <AssetIcon symbol={pool.token.ticker as SWAP_ASSET} />
        </div>
        <div className="column-1-item token-content">
          <div>
            {pool.quote.ticker} / {pool.token.ticker}
          </div>
          <div className="token-item">$35,266.387</div>
        </div>
        <div className="column-1-item percent">
          <img
            className="percent-img"
            src="https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/1839.svg"
            alt=""
          />
        </div>
      </div>

      <div className="pool-card-item column-2 mobile-hidden">
        <table>
          <tbody>
            <tr>
              <th>
                <span>TVL</span>&nbsp; <Tag color="green">Green</Tag>
              </th>
              {showDetail && (
                <>
                  <th>
                    <span>Volume</span>&nbsp; <Tag color="red">Red</Tag>
                  </th>
                  <th>
                    <span>Fees</span>&nbsp; <Tag color="green">Green</Tag>
                  </th>
                </>
              )}
            </tr>
            <tr>
              <td>${Numeral((Number(pool.token.value) * 2) / PREFERRED_UNIT_VALUE.LBTC).format('(0.00a)')}</td>
              {showDetail && (
                <>
                  <td>${Numeral(0).format('(0.00a)')}</td>
                  <td>${Numeral(0).format('(0.00a)')}</td>
                </>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
