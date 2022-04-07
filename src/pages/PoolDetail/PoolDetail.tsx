import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { usePoolChartDataContext, usePoolContext, useSettingsContext } from '../../context';
import { ROUTE_PATH } from '../../enum/ROUTE_PATH';
import { calculateChartData } from '../../components/utils/utils';
import { Button } from 'rsuite';
import { ParentSize } from '@visx/responsive';
import AreaChart, { ChartData } from '../../components/AreaChart/AreaChart';
import { quoteAmountRound } from '../../helper';
import { TabMenu } from '../../components/TabMenu/TabMenu';
import { POOL_DETAIL_TABS } from '../../enum/POOL_DETAIL_TABS';
import { Pool } from '@bitmatrix/models';
import Numeral from 'numeral';
import { PREFERRED_UNIT_VALUE } from '../../enum/PREFERRED_UNIT_VALUE';
import { BackButton } from '../../components/base/BackButton/BackButton';
import LbtcIcon from '../../components/base/Svg/Icons/Lbtc';
import TetherIcon from '../../components/base/Svg/Icons/Tether';
// import { CustomPopover } from '../../components/CustomPopover/CustomPopover';
// import info from '../../images/info2.png';
import './PoolDetail.scss';
import { Helmet } from 'react-helmet';

export const PoolDetail: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<POOL_DETAIL_TABS>(POOL_DETAIL_TABS.PRICE);
  const [pool, setPool] = useState<Pool>();
  const [loading, setLoading] = useState(true);

  const { poolsContext } = usePoolContext();
  const { poolChartDataContext } = usePoolChartDataContext();
  const { settingsContext } = useSettingsContext();

  const history = useHistory();

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (poolsContext && poolsContext.length > 0) {
      const currentPool = poolsContext.find((pl) => pl.id === id);
      setPool(currentPool);
    }
  }, [poolsContext]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, []);

  const renderChart = (allData: any) => {
    let data: ChartData[] = [
      {
        date: '',
        close: 0,
      },
    ];

    let key = '';

    if (selectedTab === POOL_DETAIL_TABS.PRICE) {
      key = 'price';
      data = allData.allPriceData;
    } else if (selectedTab === POOL_DETAIL_TABS.VOLUME) {
      key = 'volume';
      data = allData.allVolumeData;
    } else if (selectedTab === POOL_DETAIL_TABS.LIQUIDITY) {
      key = 'liquidity';
      data = allData.allTvlData;
    } else if (selectedTab === POOL_DETAIL_TABS.FEES) {
      key = 'fees';
      data = allData.allFeeData;
    }

    return (
      <ParentSize key={key}>
        {({ width, height }) => <AreaChart width={width} height={height} data={data} />}
      </ParentSize>
    );
  };

  if (pool === undefined || poolChartDataContext === undefined) {
    return <div className="no-pool-text">Pool couldn't found.</div>;
  } else {
    const data = calculateChartData(poolChartDataContext, pool);
    return (
      <div className="pool-detail-container">
        <Helmet>
          <meta property="og:url" content={`https://dev.bitmatrix.app/pool/${pool.id}`} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Pool" />
          <meta property="og:description" content="Swap assets, add liquidity, and view tL-BTC/tL-USDt pool metrics." />
          <meta property="og:image" content="https://picsum.photos/300" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta property="twitter:domain" content={`https://dev.bitmatrix.app/pool/${pool.id}`} />
          <meta property="twitter:url" content={`https://dev.bitmatrix.app/pool/${pool.id}`} />
          <meta name="twitter:title" content="Bitmatrix tL-BTC/tL-USDt Liquidity Pool" />
          <meta
            name="twitter:description"
            content="Swap assets, add liquidity, and view tL-BTC/tL-USDt pool metrics."
          />
          <meta name="twitter:image" content="https://picsum.photos/300" />
        </Helmet>
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
            <div className="pool-detail-content-right desktop-hidden">{!loading && renderChart(data)}</div>
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
                    <LbtcIcon className="pool-detail-img" width="1.5rem" height="1.5rem" />
                    {quoteAmountRound(Number(pool.quote.value) / settingsContext.preferred_unit.value)}
                  </div>
                </div>

                <div className="pool-detail-amount-item">
                  <div className="pool-detail-img-content">
                    <TetherIcon className="pool-detail-img" width="1.5rem" height="1.5rem" />
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
                    <div className="pool-detail-table-text">${data.todayPrice.toLocaleString()}</div>
                    <div className="pool-detail-icon-content">
                      {data.priceRate.icon}
                      <span className={`pool-detail-table-arrow-${data.priceRate.direction}-text`}>
                        {data.priceRate.value}%
                      </span>
                    </div>
                  </div>
                  <div className="pool-metrics-item">
                    <div>Volume 24h</div>
                    <div className="pool-detail-table-text">
                      ${Numeral(data.todayVolumeData.close).format('(0.00a)')}
                    </div>
                    <div className="pool-detail-icon-content">
                      {data.volumeRate.icon}
                      <span className={`pool-detail-table-arrow-${data.volumeRate.direction}-text`}>
                        {data.volumeRate.value}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pool-metrics-content">
                  <div className="pool-metrics-item">
                    <div>TVL</div>
                    <div className="pool-detail-table-text">${Numeral(data.todayTvlData).format('(0.00a)')}</div>
                    <div className="pool-detail-icon-content">
                      {data.tvlRate.icon}
                      <span className={`pool-detail-table-arrow-${data.tvlRate.direction}-text`}>
                        {data.tvlRate.value}%
                      </span>
                    </div>
                  </div>
                  <div className="pool-metrics-item">
                    <div>Fees 24h</div>
                    <div className="pool-detail-table-text">${Numeral(data.todayFeeData.close).format('(0.00a)')}</div>
                    <div className="pool-detail-icon-content">
                      {data.feeRate.icon}
                      <span className={`pool-detail-table-arrow-${data.feeRate.direction}-text`}>
                        {data.feeRate.value}%
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
            <div className="pool-detail-content-right mobile-hidden">{!loading && renderChart(data)}</div>
          </div>
        </div>
      </div>
    );
  }
};
