import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useBtcPriceContext, usePoolContext, useSettingsContext } from '../../context';
import { ROUTE_PATH } from '../../enum/ROUTE_PATH';
import { arrowIconDirection } from '../../components/utils/utils';
import { Button } from 'rsuite';
import { ParentSize } from '@visx/responsive';
import AreaChart, { ChartData } from '../../components/AreaChart/AreaChart';
import { calculateUsdtPrice, getAssetPrecession, amountRound } from '../../helper';
import { TabMenu } from '../../components/base/TabMenu/TabMenu';
import { POOL_DETAIL_TABS } from '../../enum/POOL_DETAIL_TABS';
import { ChartSummary, Pool } from '@bitmatrix/models';
import Numeral from 'numeral';
import { BackButton } from '../../components/base/BackButton/BackButton';
import { AssetIcon } from '../../components/AssetIcon/AssetIcon';
import { Loading } from '../../components/base/Loading/Loading';
import { useChartsContext } from '../../context/charts';
import { lbtcAsset } from '../../lib/liquid-dev/ASSET';
import './PoolDetail.scss';
import { PREFERRED_UNIT_VALUE } from '../../enum/PREFERRED_UNIT_VALUE';

export const PoolDetail: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<POOL_DETAIL_TABS>(POOL_DETAIL_TABS.PRICE);
  const [chartData, setChartData] = useState<ChartSummary>({
    poolId: '',
    tvl: {
      todayValue: 0,
      rate: {
        value: '0',
        direction: '',
      },
      allTvlData: [{ close: 0, date: new Date().toISOString() }],
    },
    volume: {
      todayValue: 0,
      rate: {
        value: '0',
        direction: '',
      },
      allVolumeData: [{ close: 0, date: new Date().toISOString() }],
    },
    fees: {
      todayValue: 0,
      rate: {
        value: '0',
        direction: '',
      },
      allFeesData: [{ close: 0, date: new Date().toISOString() }],
    },
    price: {
      todayValue: 0,
      rate: {
        value: '0',
        direction: '',
      },
      allPriceData: [{ close: 0, date: new Date().toISOString() }],
    },
  });
  const [pool, setPool] = useState<Pool>();
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);

  const { pools } = usePoolContext();
  const { settingsContext } = useSettingsContext();
  const { btcPrice } = useBtcPriceContext();

  const { charts } = useChartsContext();

  const history = useHistory();

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const currentChart = charts.find((chart) => chart.poolId === id);

    if (currentChart) {
      setChartData(currentChart);
    }
  }, [charts, id]);

  useEffect(() => {
    if (pools && pools.length > 0) {
      const currentPool = pools.find((pl) => pl.id === id);
      setPool(currentPool);
      setLoading(false);
    }
    setTimeout(() => {
      setChartLoading(false);
    }, 200);
  }, [id, pools]);

  const renderChart = () => {
    const defaultData: ChartData[] | undefined = [
      {
        date: '',
        close: 0,
      },
    ];

    let key = '';
    let data: ChartData[] = [];

    if (pool) {
      if (selectedTab === POOL_DETAIL_TABS.PRICE) {
        key = 'price';

        if (pool.quote.assetHash === lbtcAsset.assetHash) {
          data = chartData?.price.allPriceData.map((apd) => {
            return { close: Number(calculateUsdtPrice(btcPrice, apd.close).toFixed(4)), date: apd.date };
          });
        } else {
          data = chartData?.price.allPriceData || defaultData;
        }
      } else if (selectedTab === POOL_DETAIL_TABS.VOLUME) {
        key = 'volume';
        data = chartData?.volume.allVolumeData || defaultData;
      } else if (selectedTab === POOL_DETAIL_TABS.LIQUIDITY) {
        key = 'liquidity';

        if (pool.quote.assetHash === lbtcAsset.assetHash && chartData.volume.allVolumeData) {
          console.log(chartData);
          data = chartData.volume.allVolumeData.map((apd) => {
            return {
              close: Number(calculateUsdtPrice(btcPrice, apd.close * PREFERRED_UNIT_VALUE.LBTC).toFixed(4)),
              date: apd.date,
            };
          });

          console.log(data);
        } else {
          data = chartData?.tvl.allTvlData || defaultData;
        }
      } else if (selectedTab === POOL_DETAIL_TABS.FEES) {
        key = 'fees';
        data = chartData?.fees.allFeesData || defaultData;
      }
    }

    return (
      <ParentSize key={key}>
        {({ width, height }) => <AreaChart width={width} height={height} data={data} />}
      </ParentSize>
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Loading width="2rem" height="2rem" />
      </div>
    );
  }

  if (pool === undefined) {
    return <div className="no-pool-text">Pool couldn't found.</div>;
  } else {
    const price =
      pool.quote.assetHash === lbtcAsset.assetHash
        ? btcPrice / pool.tokenPrice
        : chartData?.price.todayValue || Number(pool.tokenPrice);

    const tvl =
      pool.quote.assetHash === lbtcAsset.assetHash && chartData
        ? calculateUsdtPrice(
            btcPrice,
            chartData?.tvl.todayValue * PREFERRED_UNIT_VALUE.LBTC ||
              (Number(pool.quote.value) / Math.pow(10, pool.quote.precision)) * 2,
          )
        : chartData?.tvl.todayValue || (Number(pool.quote.value) / Math.pow(10, pool.quote.precision)) * 2;

    const fees =
      pool.quote.assetHash === lbtcAsset.assetHash
        ? calculateUsdtPrice(btcPrice || 0, chartData?.fees.todayValue || 0)
        : chartData?.fees.todayValue || 0;

    const volume =
      pool.quote.assetHash === lbtcAsset.assetHash
        ? calculateUsdtPrice(btcPrice || 0, chartData?.volume.todayValue || 0)
        : chartData?.volume.todayValue || 0;

    return (
      <div className="pool-detail-container">
        <div className="pool-detail-main">
          <div className="pool-detail-header">
            <div className="pool-detail-header-left">
              <BackButton
                buttonText={`${pool.quote.ticker} / ${pool.token.ticker}`}
                onClick={() => {
                  history.push({
                    pathname: ROUTE_PATH.POOL,
                    state: {
                      from: history.location.pathname,
                    },
                  });
                }}
              />
            </div>
            <div className="pool-detail-header-right">
              <TabMenu
                menuItems={[
                  POOL_DETAIL_TABS.PRICE,
                  POOL_DETAIL_TABS.VOLUME,
                  POOL_DETAIL_TABS.LIQUIDITY,
                  POOL_DETAIL_TABS.FEES,
                ]}
                selectedItem={selectedTab}
                onClick={(eventKey: any) => setSelectedTab(eventKey)}
              />
            </div>
          </div>
          <div className="pool-detail-content">
            <div className="pool-detail-content-right desktop-hidden">{!loading && renderChart()}</div>
            <div className="pool-detail-content-left mobile-hidden">
              <div className="pool-detail-content-left-header">
                <span>Total Pooled Assets</span>
              </div>
              <div className="pool-detail-amount">
                <div className="pool-detail-amount-item">
                  <div className="pool-detail-img-content">
                    <AssetIcon
                      className="pool-detail-img"
                      width="1.5rem"
                      height="1.5rem"
                      asset={pool.quote.assetHash}
                    />
                    {amountRound(
                      Number(pool.quote.value) /
                        Math.pow(10, getAssetPrecession(pool.quote, settingsContext.preferred_unit.text)),
                    )}
                  </div>
                </div>

                <div className="pool-detail-amount-item">
                  <div className="pool-detail-img-content">
                    <AssetIcon
                      className="pool-detail-img"
                      width="1.5rem"
                      height="1.5rem"
                      asset={pool.token.assetHash}
                    />
                    {amountRound(
                      Number(pool.token.value) /
                        Math.pow(10, getAssetPrecession(pool.token, settingsContext.preferred_unit.text)),
                    )}
                  </div>
                </div>
              </div>

              <div className="pool-detail-content-left-header">
                <span>Pool Metrics</span>
              </div>

              <div className="pool-metrics">
                <div className="pool-metrics-content">
                  <div className="pool-metrics-item">
                    <div>{pool.token.ticker} Price</div>
                    <div className="pool-detail-table-text">${price.toLocaleString()}</div>
                    <div className="pool-detail-icon-content">
                      {arrowIconDirection(chartData?.price.rate.direction)}
                      <span className={`pool-detail-table-arrow-${chartData?.price.rate.direction}-text`}>
                        {chartData?.price.rate.value}%
                      </span>
                    </div>
                  </div>
                  <div className="pool-metrics-item">
                    <div>Volume 24h</div>
                    <div className="pool-detail-table-text">${Numeral(volume).format('(0.00a)')}</div>
                    <div className="pool-detail-icon-content">
                      {arrowIconDirection(chartData?.volume.rate.direction)}
                      <span className={`pool-detail-table-arrow-${chartData?.volume.rate.direction}-text`}>
                        {chartData?.volume.rate.value}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pool-metrics-content">
                  <div className="pool-metrics-item">
                    <div>TVL</div>
                    <div className="pool-detail-table-text">${Numeral(tvl).format('(0.00a)')}</div>
                    <div className="pool-detail-icon-content">
                      {arrowIconDirection(chartData?.tvl.rate.direction)}
                      <span className={`pool-detail-table-arrow-${chartData?.tvl.rate.direction}-text`}>
                        {chartData?.tvl.rate.value}%
                      </span>
                    </div>
                  </div>
                  <div className="pool-metrics-item">
                    <div>Fees 24h</div>
                    <div className="pool-detail-table-text">${Numeral(fees).format('(0.00a)')}</div>
                    <div className="pool-detail-icon-content">
                      {arrowIconDirection(chartData?.fees.rate.direction)}
                      <span className={`pool-detail-table-arrow-${chartData?.fees.rate.direction}-text`}>
                        {chartData?.fees.rate.value}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                appearance="default"
                className="primary-button pool-detail-add-button mobile-hidden"
                onClick={() => {
                  history.push({
                    pathname: ROUTE_PATH.POOL + '/' + pool.id + '/add-liquidity',
                    state: {
                      from: history.location.pathname,
                    },
                  });
                }}
              >
                Add Liquidity
              </Button>
            </div>
            <div className="pool-detail-content-right mobile-hidden">{!chartLoading && renderChart()}</div>
          </div>
        </div>
      </div>
    );
  }
};
