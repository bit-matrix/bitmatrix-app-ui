import React, { useContext } from 'react';
import { Pool } from '@bitmatrix/models';
import { calculateChartData } from '../utils/utils';
import SWAP_ASSET from '../../enum/SWAP_ASSET';
import Numeral from 'numeral';
import { AssetIcon } from '../AssetIcon/AssetIcon';
import { Tag } from 'rsuite';
import { XyChart } from '../XyChart/XyChart';
import SettingsContext from '../../context/SettingsContext';
import './PoolCard.scss';

type Props = {
  rank: number;
  pool: Pool;
  onClick: (poolId: string) => void;
  showDetail?: boolean;
};

export const PoolCard: React.FC<Props> = ({ pool, rank, onClick, showDetail = true }) => {
  const { payloadData } = useContext(SettingsContext);

  if (payloadData.pool_chart_data === undefined) {
    return <span>Something went wrong.</span>;
  } else {
    const data = calculateChartData(payloadData.pool_chart_data, pool);
    const chartColor = data.priceRate.direction === 'up' ? '#78B98C' : '#de5b4c';
    return (
      <div className="pool-card-main" onClick={() => onClick(pool.id)}>
        <div className={`pool-card-item column-1 ${!showDetail && 'pool-card-modal-content'}`}>
          <div className="column-1-item order-item">#{rank}</div>
          <div className="column-1-item ">
            <AssetIcon symbol={pool.quote.ticker as SWAP_ASSET} />
            <AssetIcon symbol={pool.token.ticker as SWAP_ASSET} />
          </div>
          <div className="column-1-item token-content">
            <div>
              {pool.quote.ticker} / {pool.token.ticker}
            </div>
            <div className={`token-item pool-card-${data.priceRate.direction}-text`}>
              ${data.todayPrice.toLocaleString()}
            </div>
          </div>
          <div className="column-1-item percent">
            <XyChart data={data.allPriceData} color={chartColor} />
          </div>
        </div>

        <div className={`pool-card-item mobile-hidden ${!showDetail && 'pool-card-modal-content'}`}>
          <ul className="pool-card-list">
            <li>
              <div>
                <span>TVL</span>&nbsp;
                <Tag color={`${data.tvlRate.direction === 'up' ? 'green' : 'red'}`}>{data.tvlRate.value}%</Tag>
              </div>
              <div>${Numeral(data.todayTvlData).format('(0.00a)')}</div>
            </li>
            {showDetail && (
              <>
                <li>
                  <div>
                    <span>Volume</span>&nbsp;
                    <Tag color={`${data.volumeRate.direction === 'up' ? 'green' : 'red'}`}>
                      {data.volumeRate.value}%
                    </Tag>
                  </div>
                  <div>${Numeral(data.todayVolumeData.close).format('(0.00a)')}</div>
                </li>
                <li>
                  <div>
                    <span>Fees</span>&nbsp;
                    <Tag color={`${data.feeRate.direction === 'up' ? 'green' : 'red'}`}>{data.feeRate.value}%</Tag>
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
