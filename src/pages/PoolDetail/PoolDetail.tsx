import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { api } from '@bitmatrix/lib';
import { ROUTE_PATH } from '../../enum/ROUTE_PATH';
import { calculateChartData } from './utils';
import { Button, Loader } from 'rsuite';
import { ParentSize } from '@visx/responsive';
import AreaChart, { ChartData } from '../../components/AreaChart/AreaChart';
import { TabMenu } from '../../components/TabMenu/TabMenu';
import { POOL_DETAIL_TABS } from '../../enum/POOL_DETAIL_TABS';
import lbtcImage from '../../images/liquid_btc.png';
import usdtImage from '../../images/usdt.png';
import { BmChart, Pool } from '@bitmatrix/models';
import Numeral from 'numeral';
import { PREFERRED_UNIT_VALUE } from '../../enum/PREFERRED_UNIT_VALUE';
import SettingsContext from '../../context/SettingsContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
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
                <FontAwesomeIcon icon={faAngleLeft} size="3x" />
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
              <div className="pool-detail-content-left-header">Pool Pairs</div>
              <div className="pool-detail-amount">
                <div className="pool-detail-item">
                  <div className="pool-detail-img-content left-side">
                    <img className="pool-detail-img" src={lbtcImage} alt="" />
                    <span className="mobile-hidden">{pool.quote.ticker}</span>
                  </div>
                  {Numeral(Number(pool.quote.value) / PREFERRED_UNIT_VALUE.LBTC).format('(0.00a)')}
                </div>

                <div className="pool-detail-item">
                  <div className="pool-detail-img-content left-side">
                    <img className="pool-detail-img" src={usdtImage} alt="" />
                    <span className="mobile-hidden">{pool.token.ticker}</span>
                  </div>
                  {Numeral(Number(pool.token.value) / PREFERRED_UNIT_VALUE.LBTC).format('(0.00a)')}
                </div>
              </div>

              <div className="pool-detail-volume-fee">
                <div className="pool-detail-item">
                  <div className="left-side">{pool.quote.ticker} Price</div>
                  <div>Volume 24h</div>
                </div>
                <div className="pool-detail-item">
                  <div className="pool-detail-table-text left-side">${data.todayPrice.toLocaleString()}</div>
                  <div className="pool-detail-table-text">${Numeral(data.todayVolumeData.close).format('(0.00a)')}</div>
                </div>
                <div className="pool-detail-item-detail">
                  <div className="left-side">
                    {/* TODO icon color */}
                    <FontAwesomeIcon icon={data.priceRate.icon} />
                    <span className={`pool-detail-table-arrow-${data.priceRate.direction}-text`}>
                      {data.priceRate.value}%
                    </span>
                  </div>
                  <div>
                    {/* TODO icon color */}
                    <FontAwesomeIcon icon={data.volumeRate.icon} />
                    <span className={`pool-detail-table-arrow-${data.volumeRate.direction}-text`}>
                      {data.volumeRate.value}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="pool-detail-volume-fee">
                <div className="pool-detail-item">
                  <div className="left-side">TVL</div>
                  <div>Fees 24h</div>
                </div>
                <div className="pool-detail-item">
                  <div className="pool-detail-table-text left-side">
                    ${Numeral(data.todayTvlData).format('(0.00a)')}
                  </div>
                  <div className="pool-detail-table-text">${Numeral(data.todayFeeData.close).format('(0.00a)')}</div>
                </div>
                <div className="pool-detail-item-detail">
                  <div className="left-side">
                    <FontAwesomeIcon icon={data.tvlRate.icon} />
                    <span className={`pool-detail-table-arrow-${data.tvlRate.direction}-text`}>
                      {data.tvlRate.value}%
                    </span>
                  </div>
                  <div>
                    <FontAwesomeIcon icon={data.feeRate.icon} />
                    <span className={`pool-detail-table-arrow-${data.feeRate.direction}-text`}>
                      {data.feeRate.value}%
                    </span>
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
