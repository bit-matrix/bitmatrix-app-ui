import React from 'react';
import { AssetIcon } from '../AssetIcon/AssetIcon';
import Numeral from 'numeral';
import { Pool } from '@bitmatrix/models';
import SWAP_ASSET from '../../enum/SWAP_ASSET';
import { PREFERRED_UNIT_VALUE } from '../../enum/PREFERRED_UNIT_VALUE';
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
        <div className="column-1-item token-item">
          {pool.quote.ticker} / {pool.token.ticker}
        </div>
        <div className="column-1-item percent">0.2%</div>
      </div>

      <div className="pool-card-item column-2 mobile-hidden">
        <table>
          <tbody>
            <tr>
              <th>TVL</th>
              {showDetail && (
                <>
                  <th>Volume 24h</th>
                  <th>Fees 24h</th>
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
