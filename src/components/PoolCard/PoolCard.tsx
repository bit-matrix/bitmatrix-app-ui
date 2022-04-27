import React from 'react';
import { Pool } from '@bitmatrix/models';
import { calculateChartData } from '../utils/utils';
import SWAP_ASSET from '../../enum/SWAP_ASSET';
import Numeral from 'numeral';
import { AssetIcon } from '../AssetIcon/AssetIcon';
import { Tag } from 'rsuite';
import { XyChart } from '../XyChart/XyChart';
import { usePoolChartDataContext } from '../../context';
import './PoolCard.scss';

type Props = {
  rank: number;
  pool: Pool;
  onClick: (poolId: string) => void;
  showDetail?: boolean;
};

export const PoolCard: React.FC<Props> = ({ pool, rank, onClick, showDetail = true }) => {
  const { poolChartDataContext } = usePoolChartDataContext();

  if (poolChartDataContext === undefined) {
    return <span>Something went wrong.</span>;
  } else {
    const data = calculateChartData(poolChartDataContext, pool);
    const chartColor = data.priceRate.direction === 'up' ? '#4caf50' : '#f44336';
    return (
      <div className="pool-card-main" onClick={() => onClick(pool.id)}>
        <div className={`pool-card-column ${!showDetail && 'pool-card-modal-column-1'}`}>
          <ul className="pool-card-list">
            <li className="column-1-item">#{rank}</li>
            <li className="column-1-item ">
              <AssetIcon asset={{ assetHash: pool.quote.asset, precision: 0 }} />
              <AssetIcon asset={{ assetHash: pool.token.asset, precision: 0 }} />
            </li>
            <li className="column-1-item">
              <div>
                {pool.quote.ticker} / {pool.token.ticker}
              </div>
              <div className={`token-item pool-card-${data.priceRate.direction}-text`}>
                ${data.todayPrice.toLocaleString()}
              </div>
            </li>
            <li className="column-1-item percent">
              <XyChart data={data.allPriceData} color={chartColor} />
            </li>
          </ul>
        </div>

        <div className={`pool-card-column mobile-hidden ${!showDetail && 'pool-card-modal-column-2'}`}>
          <ul className="pool-card-list">
            <li>
              <div>
                <span>TVL</span>&nbsp;
                <Tag className="pool-card-tag" color={`${data.tvlRate.direction === 'up' ? 'green' : 'red'}`}>
                  {Number(data.tvlRate.value)}%
                </Tag>
              </div>
              <div>${Numeral(data.todayTvlData).format('(0.00a)')}</div>
            </li>
            {showDetail && (
              <>
                <li>
                  <div>
                    <span>Volume</span>&nbsp;
                    <Tag className="pool-card-tag" color={`${data.volumeRate.direction === 'up' ? 'green' : 'red'}`}>
                      {Number(data.volumeRate.value)}%
                    </Tag>
                  </div>
                  <div>${Numeral(data.todayVolumeData.close).format('(0.00a)')}</div>
                </li>
                <li>
                  <div>
                    <span>Fees</span>&nbsp;
                    <Tag className="pool-card-tag" color={`${data.feeRate.direction === 'up' ? 'green' : 'red'}`}>
                      {Number(data.feeRate.value)}%
                    </Tag>
                  </div>
                  <div>${Numeral(data.todayFeeData.close).format('(0.00a)')}</div>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    );
  }
};
