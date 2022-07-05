import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { usePoolContext, useSettingsContext } from '../../context';
import { useChartSocket } from '../../hooks/useChartSocket';
import { ROUTE_PATH } from '../../enum/ROUTE_PATH';
import { arrowIconDirection } from '../../components/utils/utils';
import { Button } from 'rsuite';
import { ParentSize } from '@visx/responsive';
import AreaChart, { ChartData } from '../../components/AreaChart/AreaChart';
import { quoteAmountRound } from '../../helper';
import { TabMenu } from '../../components/base/TabMenu/TabMenu';
import { POOL_DETAIL_TABS } from '../../enum/POOL_DETAIL_TABS';
import { Pool } from '@bitmatrix/models';
import Numeral from 'numeral';
import { PREFERRED_UNIT_VALUE } from '../../enum/PREFERRED_UNIT_VALUE';
import { BackButton } from '../../components/base/BackButton/BackButton';
import { AssetIcon } from '../../components/AssetIcon/AssetIcon';
import { Loading } from '../../components/base/Loading/Loading';
import './PoolDetail.scss';

export const PoolDetail: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<POOL_DETAIL_TABS>(POOL_DETAIL_TABS.PRICE);
  const [pool, setPool] = useState<Pool>();
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);

  const { poolsContext } = usePoolContext();
  const { settingsContext } = useSettingsContext();

  const history = useHistory();

  const { id } = useParams<{ id: string }>();

  const { chartData } = useChartSocket(id);

  useEffect(() => {
    if (poolsContext && poolsContext.length > 0) {
      const currentPool = poolsContext.find((pl) => pl.id === id);
      setPool(currentPool);
      setLoading(false);
    }
    setTimeout(() => {
      setChartLoading(false);
    }, 200);
  }, [poolsContext]);

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
        data = chartData?.price.allPriceData || defaultData;
      } else if (selectedTab === POOL_DETAIL_TABS.VOLUME) {
        key = 'volume';
        data = chartData?.volume.allVolumeData || defaultData;
      } else if (selectedTab === POOL_DETAIL_TABS.LIQUIDITY) {
        key = 'liquidity';
        data = chartData?.tvl.allTvlData || defaultData;
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
                {/* <CustomPopover
                  placement="autoHorizontal"
                  title="Total Pooled Assets"
                  content="Lorem Ipsum is simply dummy text of the printing and typesetting industry.."
                >
                  <img className="general-icon" src={info} alt="info" />
                </CustomPopover> */}
              </div>
              <div className="pool-detail-amount">
                <div className="pool-detail-amount-item">
                  <div className="pool-detail-img-content">
                    <AssetIcon className="pool-detail-img" width="1.5rem" height="1.5rem" asset={pool.quote} />
                    {quoteAmountRound(Number(pool.quote.value) / settingsContext.preferred_unit.value)}
                  </div>
                </div>

                <div className="pool-detail-amount-item">
                  <div className="pool-detail-img-content">
                    <AssetIcon className="pool-detail-img" width="1.5rem" height="1.5rem" asset={pool.token} />
                    {Numeral(Number(pool.token.value) / PREFERRED_UNIT_VALUE.LBTC).format('(0.00a)')}
                  </div>
                </div>
              </div>

              <div className="pool-detail-content-left-header">
                <span>Pool Metrics</span>
                {/* <CustomPopover
                  placement="autoHorizontal"
                  title="Pool Metrics"
                  content="Lorem Ipsum is simply dummy text of the printing and typesetting industry.."
                >
                  <img className="general-icon" src={info} alt="info" />
                </CustomPopover> */}
              </div>

              <div className="pool-metrics">
                <div className="pool-metrics-content">
                  <div className="pool-metrics-item">
                    <div>{pool.quote.ticker} Price</div>
                    <div className="pool-detail-table-text">${chartData?.price.todayValue.toLocaleString()}</div>
                    <div className="pool-detail-icon-content">
                      {arrowIconDirection(chartData?.price.rate.direction)}
                      <span className={`pool-detail-table-arrow-${chartData?.price.rate.direction}-text`}>
                        {chartData?.price.rate.value}%
                      </span>
                    </div>
                  </div>
                  <div className="pool-metrics-item">
                    <div>Volume 24h</div>
                    <div className="pool-detail-table-text">
                      ${Numeral(chartData?.volume.todayValue).format('(0.00a)')}
                    </div>
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
                    <div className="pool-detail-table-text">
                      ${Numeral(chartData?.tvl.todayValue).format('(0.00a)')}
                    </div>
                    <div className="pool-detail-icon-content">
                      {arrowIconDirection(chartData?.tvl.rate.direction)}
                      <span className={`pool-detail-table-arrow-${chartData?.tvl.rate.direction}-text`}>
                        {chartData?.tvl.rate.value}%
                      </span>
                    </div>
                  </div>
                  <div className="pool-metrics-item">
                    <div>Fees 24h</div>
                    <div className="pool-detail-table-text">
                      ${Numeral(chartData?.fees.todayValue).format('(0.00a)')}
                    </div>
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
