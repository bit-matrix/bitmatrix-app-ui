import React, { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ROUTE_PATH } from '../../enum/ROUTE_PATH';
import { Button, Icon, Loader } from 'rsuite';
import { ParentSize } from '@visx/responsive';
import AreaChart, { ChartData } from '../AreaChart/AreaChart';
import { TabMenu } from '../TabMenu/TabMenu';
import { POOL_DETAIL_TABS } from '../../enum/POOL_DETAIL_TABS';
import lbtcImage from '../../images/liquid_btc.png';
import usdtImage from '../../images/usdt.png';
import { Pool, BmChart } from '@bitmatrix/models';
import Numeral from 'numeral';
import { api } from '@bitmatrix/lib';
import './PoolDetail.scss';

type Props = {
  pool: Pool;
  back: () => void;
};

export const PoolDetail: React.FC<Props> = ({ pool, back }) => {
  const [selectedTab, setSelectedTab] = useState<POOL_DETAIL_TABS>(POOL_DETAIL_TABS.PRICE);
  const [chartData, setChartData] = useState<BmChart[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const price = (Number(pool.token.value) / Number(pool.quote.value)).toLocaleString();

  const history = useHistory();

  useEffect(() => {
    api
      .getPoolChartData(pool.id)
      .then((poolChartData: BmChart[]) => {
        setChartData(poolChartData);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pool.id]);

  const groupBydailyPrice = useMemo(() => {
    if (chartData.length === 0) return [];

    const res = chartData.map((d) => {
      const datetime = new Date(d.time * 1000);
      const date =
        datetime.getUTCFullYear() +
        '-' +
        (datetime.getUTCMonth() + 1).toString().padStart(2, '0') +
        '-' +
        datetime.getUTCDate().toString().padStart(2, '0');
      return { price: d.price, date };
    });

    const result = [];

    let currentDate = res[0].date;
    let cumprice = res[0].price;
    let j = 1;

    for (let i = 1; i < res.length; i++) {
      const r = res[i];

      if (currentDate === r.date) {
        cumprice += r.price;
        j++;
      } else {
        result.push({ date: res[i - 1].date, close: Math.floor(cumprice / j) });

        currentDate = r.date;
        cumprice = r.price;
        j = 1;
      }
    }

    result.push({ date: res[res.length - 1].date, close: Math.floor(cumprice / j) });

    return result;
  }, [chartData]);

  const groupBydailyVolume = useMemo(() => {
    if (chartData.length === 0) return [];

    const res = chartData.map((d) => {
      const datetime = new Date(d.time * 1000);
      const date =
        datetime.getUTCFullYear() +
        '-' +
        (datetime.getUTCMonth() + 1).toString().padStart(2, '0') +
        '-' +
        datetime.getUTCDate().toString().padStart(2, '0');
      return { volume: Math.floor(d.volume.token / 100000000), date };
    });

    const result = [];

    let currentDate = res[0].date;
    let totalVolume = res[0].volume;

    for (let i = 1; i < res.length; i++) {
      const r = res[i];

      if (currentDate === r.date) {
        totalVolume += r.volume;
      } else {
        result.push({ date: res[i - 1].date, close: totalVolume });

        currentDate = r.date;
        totalVolume = r.volume;
      }
    }

    result.push({ date: res[res.length - 1].date, close: totalVolume });
    return result;
  }, [chartData]);

  const groupByDailyTvl = useMemo(() => {
    if (chartData.length === 0) return [];

    const res = chartData.map((d) => {
      const datetime = new Date(d.time * 1000);
      const date =
        datetime.getUTCFullYear() +
        '-' +
        (datetime.getUTCMonth() + 1).toString().padStart(2, '0') +
        '-' +
        datetime.getUTCDate().toString().padStart(2, '0');
      return { close: Math.floor(d.value.token / 100000000), date };
    });

    const result = [];

    let currentDate = res[0].date;
    let cumclose = res[0].close;
    let j = 1;

    for (let i = 1; i < res.length; i++) {
      const r = res[i];

      if (currentDate === r.date) {
        cumclose += r.close;
        j++;
      } else {
        result.push({ date: res[i - 1].date, close: Math.floor(cumclose / j) * 2 });

        currentDate = r.date;
        cumclose = r.close;
        j = 1;
      }
    }

    result.push({ date: res[res.length - 1].date, close: Math.floor(cumclose / j) * 2 });

    return result;
  }, [chartData]);

  const renderChart = () => {
    let data: ChartData[] = [
      {
        date: '2021-05-14',
        close: 20,
      },
    ];

    let key = '';

    if (selectedTab === POOL_DETAIL_TABS.PRICE) {
      key = 'price';
      data = groupBydailyPrice;
    } else if (selectedTab === POOL_DETAIL_TABS.VOLUME) {
      key = 'volume';
      data = groupBydailyVolume;
    } else if (selectedTab === POOL_DETAIL_TABS.LIQUIDITY) {
      key = 'liquidity';
      data = groupByDailyTvl;
    } else if (selectedTab === POOL_DETAIL_TABS.FEES) {
      key = 'fees';
      data = groupBydailyVolume.map((d) => ({ ...d, close: d.close / 500 }));
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
  }

  return (
    <div className="pool-detail-container">
      <div className="pool-detail-main">
        <div className="pool-detail-header">
          <div className="pool-detail-header-left">
            <Button className="pool-detail-button" onClick={back}>
              <Icon className="pool-detail-back-icon" icon="angle-left" size="4x" />
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
          <div className="pool-detail-content-right desktop-hidden">{renderChart()}</div>
          <div className="pool-detail-content-left">
            <div className="pool-detail-content-left-header">Pool Pairs</div>
            <div className="pool-detail-amount">
              <div className="pool-detail-item">
                <div className="pool-detail-img-content left-side">
                  <img className="pool-detail-img" src={lbtcImage} alt="" />
                  <span>{pool.quote.ticker}</span>
                </div>
                {Numeral(Number(pool.quote.value) / 100000000).format('(0.00a)')}
              </div>

              <div className="pool-detail-item">
                <div className="pool-detail-img-content left-side">
                  <img className="pool-detail-img" src={usdtImage} alt="" />
                  <span>{pool.token.ticker}</span>
                </div>
                {Numeral(Number(pool.token.value) / 100000000).format('(0.00a)')}
              </div>
            </div>

            <div className="pool-detail-volume-fee">
              <div className="pool-detail-item">
                <div className="left-side">{pool.quote.ticker} Price</div>
                <div>Volume 24h</div>
              </div>
              <div className="pool-detail-item">
                <div className="pool-detail-table-text left-side">${price}</div>
                <div className="pool-detail-table-text">%0</div>
              </div>
              <div className="pool-detail-item-detail">
                <div className="left-side">
                  <Icon className="pool-detail-arrow-down-icon" icon="arrow-down2" />
                  <span className="pool-detail-table-arrow-down-text">0%</span>
                </div>
                <div>
                  <Icon className="pool-detail-arrow-up-icon" icon="arrow-up2" />
                  <span className="pool-detail-table-arrow-up-text">0%</span>
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
                  ${Numeral((Number(pool.token.value) * 2) / 100000000).format('(0.00a)')}
                </div>
                <div className="pool-detail-table-text">%0</div>
              </div>
              <div className="pool-detail-item-detail">
                <div className="left-side">
                  <Icon className="pool-detail-arrow-down-icon" icon="arrow-down2" />
                  <span className="pool-detail-table-arrow-down-text">0%</span>
                </div>
                <div>
                  <Icon className="pool-detail-arrow-up-icon" icon="arrow-up2" />
                  <span className="pool-detail-table-arrow-up-text">0%</span>
                </div>
              </div>
            </div>

            <Button
              appearance="default"
              className="primary-button pool-detail-add-button"
              onClick={() => {
                history.push(ROUTE_PATH.LIQUIDITY);
              }}
            >
              Add Liquidity
            </Button>
          </div>
          <div className="pool-detail-content-right mobile-hidden">{renderChart()}</div>
        </div>
      </div>
    </div>
  );
};
