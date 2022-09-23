import React from 'react';
import { Pool, ChartSummary } from '@bitmatrix/models';
import Numeral from 'numeral';
import { AssetIcon } from '../AssetIcon/AssetIcon';
import { Tag } from 'rsuite';
import { XyChart } from '../XyChart/XyChart';
import './PoolCard.scss';
import { lbtcAsset } from '../../lib/liquid-dev/ASSET';
import { calculateUsdtPrice } from '../../helper';
import { PREFERRED_UNIT_VALUE } from '../../enum/PREFERRED_UNIT_VALUE';

type Props = {
  rank: number;
  pool: Pool;
  chartSummary?: ChartSummary;
  onClick: (poolId: string) => void;
  showDetail?: boolean;
  btcPrice?: number;
};

export const PoolCard: React.FC<Props> = ({ pool, chartSummary, rank, onClick, showDetail = true, btcPrice }) => {
  if (pool === undefined) {
    return <span>Something went wrong.</span>;
  } else {
    const chartColor = chartSummary?.price.rate.direction === 'up' ? '#4caf50' : '#f44336';

    const price =
      pool.quote.assetHash === lbtcAsset.assetHash
        ? btcPrice || 0 * Number(pool.tokenPrice)
        : chartSummary?.price.todayValue || Number(pool.tokenPrice);

    const tvl =
      pool.quote.assetHash === lbtcAsset.assetHash && chartSummary
        ? calculateUsdtPrice(
            btcPrice || 0,
            chartSummary?.tvl.todayValue * PREFERRED_UNIT_VALUE.LBTC ||
              (Number(pool.quote.value) / Math.pow(10, pool.quote.precision)) * 2,
          )
        : chartSummary?.tvl.todayValue || (Number(pool.quote.value) / Math.pow(10, pool.quote.precision)) * 2;

    const fees =
      pool.quote.assetHash === lbtcAsset.assetHash
        ? calculateUsdtPrice(btcPrice || 0, chartSummary?.fees.todayValue || 0)
        : chartSummary?.fees.todayValue || 0;

    const volume =
      pool.quote.assetHash === lbtcAsset.assetHash
        ? calculateUsdtPrice(btcPrice || 0, chartSummary?.volume.todayValue || 0)
        : chartSummary?.volume.todayValue || 0;

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
                ${price > 0 ? price.toLocaleString() : '0.0'}
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
              <div>${Numeral(tvl).format('(0.00a)')}</div>
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
                  <div>${Numeral(volume).format('(0.00a)')}</div>
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
                  <div>${Numeral(fees).format('(0.00a)')}</div>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    );
  }
};
