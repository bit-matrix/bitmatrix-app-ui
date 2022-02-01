import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { api } from '@bitmatrix/lib';
import { ROUTE_PATH } from '../../enum/ROUTE_PATH';
import { calculateChartData } from '../../components/utils/utils';
import { Button, Loader } from 'rsuite';
import { ParentSize } from '@visx/responsive';
import AreaChart, { ChartData } from '../../components/AreaChart/AreaChart';
import { TabMenu } from '../../components/TabMenu/TabMenu';
import { POOL_DETAIL_TABS } from '../../enum/POOL_DETAIL_TABS';
import { BmChart, Pool } from '@bitmatrix/models';
import Numeral from 'numeral';
import { PREFERRED_UNIT_VALUE } from '../../enum/PREFERRED_UNIT_VALUE';
import SettingsContext from '../../context/SettingsContext';
import BackIcon from '../../components/base/Svg/Icons/Back';
import LbtcIcon from '../../components/base/Svg/Icons/Lbtc';
import TetherIcon from '../../components/base/Svg/Icons/Tether';
import { CustomPopover } from '../../components/CustomPopover/CustomPopover';
import info from '../../images/info2.png';
import './PoolDetail.scss';

export const PoolDetail: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<POOL_DETAIL_TABS>(POOL_DETAIL_TABS.PRICE);
  const [chartData, setChartData] = useState<BmChart[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pool, setPool] = useState<Pool>();

  const { payloadData } = useContext(SettingsContext);

  const history = useHistory();

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (payloadData.pools && payloadData.pools.length > 0) {
      const currentPool = payloadData.pools.find((pl) => pl.id === id);
      setPool(currentPool);
    }
  }, [payloadData.pools]);

  useEffect(() => {
    api
      .getPoolChartData(id)
      .then((poolChartData: BmChart[]) => {
        setChartData(poolChartData);
      })
      .catch(() => {
        setChartData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

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

  if (loading) {
    return (
      <div id="loaderInverseWrapper" style={{ height: 200 }}>
        <Loader size="md" inverse center content={<span>Loading...</span>} vertical />
      </div>
    );
  } else if (pool === undefined) {
    return <div className="no-pool-text">Pool couldn't found.</div>;
  } else {
    const data = calculateChartData(chartData, pool);

    return (
      <div className="pool-detail-container">
        <div className="pool-detail-main">
          <div className="pool-detail-header">
            <div className="pool-detail-header-left">
              <Button className="pool-detail-button" onClick={() => history.goBack()}>
                <BackIcon />
                <div className="pool-detail-page-text">
                  {pool.quote.ticker} / {pool.token.ticker}
                </div>
              </Button>
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
            <div className="pool-detail-content-right desktop-hidden">{renderChart(data)}</div>
            <div className="pool-detail-content-left">
              <div className="pool-detail-content-left-header">
                <span>Total Pooled Assets</span>
                <CustomPopover
                  placement="autoHorizontal"
                  title="Total Pooled Assets"
                  content="Lorem Ipsum is simply dummy text of the printing and typesetting industry.."
                >
                  <img className="general-icon" src={info} alt="info" />
                </CustomPopover>
              </div>
              <div className="pool-detail-amount">
                <div className="pool-detail-amount-item">
                  <div className="my-pool-detail-img-content left-side">
                    <LbtcIcon className="my-pool-detail-img" width="1.5rem" height="1.5rem" />
                    {Numeral(Number(pool.quote.value) / PREFERRED_UNIT_VALUE.LBTC).format('(0.00a)')}
                  </div>
                </div>

                <div className="pool-detail-amount-item">
                  <div className="my-pool-detail-img-content left-side">
                    <TetherIcon className="my-pool-detail-img" width="1.5rem" height="1.5rem" />
                    {Numeral(Number(pool.token.value) / PREFERRED_UNIT_VALUE.LBTC).format('(0.00a)')}
                  </div>
                </div>
              </div>

              <div className="pool-detail-content-left-header">
                <span>Pool Metrics</span>
                <CustomPopover
                  placement="autoHorizontal"
                  title="Pool Metrics"
                  content="Lorem Ipsum is simply dummy text of the printing and typesetting industry.."
                >
                  <img className="general-icon" src={info} alt="info" />
                </CustomPopover>
              </div>

              <div className="pool-metrics">
                <div className="pool-metrics-content">
                  <div className="pool-metrics-item">
                    <div className="left-side">{pool.quote.ticker} Price</div>
                    <div className="pool-detail-table-text left-side">${data.todayPrice.toLocaleString()}</div>
                    <div className="left-side">
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
                    <div>
                      {data.volumeRate.icon}
                      <span className={`pool-detail-table-arrow-${data.volumeRate.direction}-text`}>
                        {data.volumeRate.value}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pool-metrics-content">
                  <div className="pool-metrics-item">
                    <div className="left-side">TVL</div>
                    <div className="pool-detail-table-text">${Numeral(data.todayTvlData).format('(0.00a)')}</div>
                    <div className="left-side">
                      {data.tvlRate.icon}
                      <span className={`pool-detail-table-arrow-${data.tvlRate.direction}-text`}>
                        {data.tvlRate.value}%
                      </span>
                    </div>
                  </div>
                  <div className="pool-metrics-item">
                    <div>Fees 24h</div>
                    <div className="pool-detail-table-text">${Numeral(data.todayFeeData.close).format('(0.00a)')}</div>
                    <div>
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
                  history.push(ROUTE_PATH.POOL + '/' + pool.id + '/add-liquidity');
                }}
              >
                Add Liquidity
              </Button>
            </div>
            <div className="pool-detail-content-right mobile-hidden">{renderChart(data)}</div>
          </div>
        </div>
      </div>
    );
  }
};
