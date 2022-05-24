import React from 'react';
import { Pool } from '@bitmatrix/models';
import Numeral from 'numeral';
import { AssetIcon } from '../AssetIcon/AssetIcon';
import { Tag } from 'rsuite';
import { XyChart } from '../XyChart/XyChart';
import './PoolCard.scss';

type Props = {
  rank: number;
  pool: Pool;
  onClick: (poolId: string) => void;
  showDetail?: boolean;
};

export const PoolCard: React.FC<Props> = ({ pool, rank, onClick, showDetail = true }) => {
  if (pool === undefined) {
    return <span>Something went wrong.</span>;
  } else {
    const chartColor = pool.price.rate.direction === 'up' ? '#4caf50' : '#f44336';
    return (
      <div className="pool-card-main" onClick={() => onClick(pool.id)}>
        <div className={`pool-card-column ${!showDetail && 'pool-card-modal-column-1'}`}>
          <ul className="pool-card-list">
            <li className="column-1-item">#{rank}</li>
            <li className="column-1-item ">
              <AssetIcon asset={{ assetHash: pool.quote.assetHash, precision: 0, name: '', ticker: '' }} />
              <AssetIcon asset={{ assetHash: pool.token.assetHash, precision: 0, name: '', ticker: '' }} />
            </li>
            <li className="column-1-item">
              <div>
                {pool.quote.ticker} / {pool.token.ticker}
              </div>
              <div className={`token-item pool-card-${pool.price.rate.direction}-text`}>
                ${pool.price.value.toLocaleString()}
              </div>
            </li>
            <li className="column-1-item percent">
              <XyChart data={pool.price.allPriceData} color={chartColor} />
            </li>
          </ul>
        </div>

        <div className={`pool-card-column mobile-hidden ${!showDetail && 'pool-card-modal-column-2'}`}>
          <ul className="pool-card-list">
            <li>
              <div>
                <span>TVL</span>&nbsp;
                <Tag className="pool-card-tag" color={`${pool.tvl.rate.direction === 'up' ? 'green' : 'red'}`}>
                  {Number(pool.tvl.rate.value)}%
                </Tag>
              </div>
              <div>${Numeral(pool.tvl.value).format('(0.00a)')}</div>
            </li>
            {showDetail && (
              <>
                <li>
                  <div>
                    <span>Volume</span>&nbsp;
                    <Tag className="pool-card-tag" color={`${pool.volume.rate.direction === 'up' ? 'green' : 'red'}`}>
                      {Number(pool.volume.rate.value)}%
                    </Tag>
                  </div>
                  <div>${Numeral(pool.volume.value).format('(0.00a)')}</div>
                </li>
                <li>
                  <div>
                    <span>Fees</span>&nbsp;
                    <Tag className="pool-card-tag" color={`${pool.fees.rate.direction === 'up' ? 'green' : 'red'}`}>
                      {Number(pool.fees.rate.value)}%
                    </Tag>
                  </div>
                  <div>${Numeral(pool.fees.value).format('(0.00a)')}</div>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    );
  }
};
