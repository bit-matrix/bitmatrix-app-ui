import React from 'react';
import { Pool, ChartSummary } from '@bitmatrix/models';
import Numeral from 'numeral';
import { AssetIcon } from '../AssetIcon/AssetIcon';
import { Tag } from 'rsuite';
import { XyChart } from '../XyChart/XyChart';
import './PoolCard.scss';

type Props = {
  rank: number;
  pool: Pool;
  chartSummary?: ChartSummary;
  onClick: (poolId: string) => void;
  showDetail?: boolean;
};

export const PoolCard: React.FC<Props> = ({ pool, chartSummary, rank, onClick, showDetail = true }) => {
  if (pool === undefined) {
    return <span>Something went wrong.</span>;
  } else {
    const chartColor = chartSummary?.price.rate.direction === 'up' ? '#4caf50' : '#f44336';
    return (
      <div className="pool-card-main" onClick={() => onClick(pool.id)}>
        <div className={`pool-card-column ${!showDetail && 'pool-card-modal-column-1'}`}>
          <ul className="pool-card-list">
            <li className="column-1-item">#{rank}</li>
            <li className="column-1-item ">
              <AssetIcon asset={pool.quote.assetHash} />
              <AssetIcon asset={pool.token.assetHash} />
            </li>
            <li className="column-1-item">
              <div>
                {pool.quote.ticker} / {pool.token.ticker}
              </div>
              <div className={`token-item pool-card-${chartSummary?.price.rate.direction}-text`}>
                ${chartSummary?.price.todayValue ? chartSummary?.price.todayValue.toLocaleString() : '0.0'}
              </div>
            </li>
            <li className="column-1-item percent">
              <XyChart data={chartSummary?.price.allPriceData || []} color={chartColor} />
            </li>
          </ul>
        </div>

        <div className={`pool-card-column mobile-hidden ${!showDetail && 'pool-card-modal-column-2'}`}>
          <ul className="pool-card-list">
            <li>
              <div>
                <span>TVL</span>&nbsp;
                <Tag className="pool-card-tag" color={`${chartSummary?.tvl.rate.direction === 'up' ? 'green' : 'red'}`}>
                  {chartSummary?.tvl.rate.value ? Number(chartSummary?.tvl.rate.value) : '0.0'}%
                </Tag>
              </div>
              <div>${Numeral(chartSummary?.tvl.todayValue).format('(0.00a)')}</div>
            </li>
            {showDetail && (
              <>
                <li>
                  <div>
                    <span>Volume</span>&nbsp;
                    <Tag
                      className="pool-card-tag"
                      color={`${chartSummary?.volume.rate.direction === 'up' ? 'green' : 'red'}`}
                    >
                      {chartSummary?.volume.rate.value ? Number(chartSummary?.volume.rate.value) : '0.0'}%
                    </Tag>
                  </div>
                  <div>${Numeral(chartSummary?.volume.todayValue).format('(0.00a)')}</div>
                </li>
                <li>
                  <div>
                    <span>Fees</span>&nbsp;
                    <Tag
                      className="pool-card-tag"
                      color={`${chartSummary?.fees.rate.direction === 'up' ? 'green' : 'red'}`}
                    >
                      {chartSummary?.fees.rate.value ? Number(chartSummary?.fees.rate.value) : '0.0'}%
                    </Tag>
                  </div>
                  <div>${Numeral(chartSummary?.fees.todayValue).format('(0.00a)')}</div>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    );
  }
};
