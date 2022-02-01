import React, { useEffect, useState } from 'react';
import { api } from '@bitmatrix/lib';
import { Pool, BmChart } from '@bitmatrix/models';
import { calculateChartData } from '../utils/utils';
import SWAP_ASSET from '../../enum/SWAP_ASSET';
import Numeral from 'numeral';
import { Loading } from '../Loading/Loading';
import { AssetIcon } from '../AssetIcon/AssetIcon';
import { Tag } from 'rsuite';
import './PoolCard.scss';

type Props = {
  rank: number;
  pool: Pool;
  onClick: (poolId: string) => void;
  showDetail?: boolean;
};

export const PoolCard: React.FC<Props> = ({ pool, rank, onClick, showDetail = true }) => {
  const [chartData, setChartData] = useState<BmChart[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api
      .getPoolChartData(pool.id)
      .then((poolChartData: BmChart[]) => {
        setChartData(poolChartData);
      })
      .catch(() => {
        setChartData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pool.id]);

  const data = calculateChartData(chartData, pool);

  return (
    <div className="pool-card-main" onClick={() => onClick(pool.id)}>
      {loading ? (
        <div className="pool-card-loading-content">
          <Loading width="1.5rem" height="1.5rem" />
        </div>
      ) : (
        <>
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
              <div className="token-item">${data.todayPrice.toLocaleString()}</div>
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
                    <span>TVL</span>&nbsp; <Tag color="green">{data.tvlRate.value}%</Tag>
                  </th>
                  {showDetail && (
                    <>
                      <th>
                        <span>Volume</span>&nbsp; <Tag color="red">{data.volumeRate.value}%</Tag>
                      </th>
                      <th>
                        <span>Fees</span>&nbsp; <Tag color="green">{data.feeRate.value}%</Tag>
                      </th>
                    </>
                  )}
                </tr>
                <tr>
                  <td>${Numeral(data.todayTvlData).format('(0.00a)')}</td>
                  {showDetail && (
                    <>
                      <td>${Numeral(data.todayVolumeData.close).format('(0.00a)')}</td>
                      <td>${Numeral(data.todayFeeData.close).format('(0.00a)')}</td>
                    </>
                  )}
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
