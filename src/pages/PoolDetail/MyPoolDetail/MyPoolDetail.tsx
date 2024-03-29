import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { convertion } from '@bitmatrix/lib';
import { Pool } from '@bitmatrix/models';
import { usePoolContext, useSettingsContext, useWalletContext } from '../../../context';
import { ROUTE_PATH } from '../../../enum/ROUTE_PATH';
// import { calculateChartData } from '../../../components/utils/utils';
import { Button } from 'rsuite';
import { ParentSize } from '@visx/responsive';
import AreaChart, { ChartData } from '../../../components/AreaChart/AreaChart';
import { TabMenu } from '../../../components/base/TabMenu/TabMenu';
import { MY_POOL_DETAIL_TABS } from '../../../enum/MY_POOL_DETAIL_TABS';
import { PREFERRED_UNIT_VALUE } from '../../../enum/PREFERRED_UNIT_VALUE';
import { CustomPopover } from '../../../components/CustomPopover/CustomPopover';
import info from '../../../images/info2.png';
import Decimal from 'decimal.js';
import { BackButton } from '../../../components/base/BackButton/BackButton';
import { AssetIcon } from '../../../components/AssetIcon/AssetIcon';
import { getAssetPrecession, getMyPoolsChartData, poolShareRound, amountRound } from '../../../helper';
import { Loading } from '../../../components/base/Loading/Loading';
import './MyPoolDetail.scss';

export const MyPoolDetail: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<MY_POOL_DETAIL_TABS>(MY_POOL_DETAIL_TABS.EARNINGS);
  const [pool, setPool] = useState<Pool>();
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData[]>();

  const { pools } = usePoolContext();
  const { walletContext } = useWalletContext();
  const { settingsContext } = useSettingsContext();

  const history = useHistory();

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (pools && pools.length > 0) {
      const currentPool = pools.find((pl) => pl.id === id);
      setPool(currentPool);
      setLoading(false);
      getMyPoolsChartData(walletContext?.coins, currentPool?.lp.assetHash).then((chartData) => {
        setChartData(chartData);
        setChartLoading(false);
      });
    }
  }, [id, pool?.lp.assetHash, pools, walletContext?.coins]);

  const calcPooledAssets = () => {
    if (pool && walletContext) {
      const lpAssetId = pool.lp.assetHash;
      const lpAmountInWallet = walletContext.balances.find((bl) => bl.asset.assetHash === lpAssetId)?.amount;
      const lpAmountInWalletN = new Decimal(lpAmountInWallet || 0).ceil().toNumber();

      const quoteTokenRecipients = convertion.calcRemoveLiquidityRecipientValue(pool, lpAmountInWalletN);

      const pooledQuote = amountRound(
        Number(quoteTokenRecipients.user_lbtc_received) /
          Math.pow(10, getAssetPrecession(pool.quote, settingsContext.preferred_unit.text)),
      );

      const pooledToken = amountRound(
        Number(quoteTokenRecipients.user_token_received) /
          Math.pow(10, getAssetPrecession(pool.token, settingsContext.preferred_unit.text)),
      );
      const pooledLp = (lpAmountInWalletN / PREFERRED_UNIT_VALUE.LBTC).toFixed(8);
      const poolRate = poolShareRound(Number(quoteTokenRecipients.poolRate) * 100);

      return {
        pooledQuote,
        pooledToken,
        pooledLp,
        poolRate,
      };
    }
    return { pooledQuote: '0', pooledToken: '0', pooledLp: '0', poolRate: '0' };
  };

  const renderChart = (/*allData: any*/) => {
    const defaultData: ChartData[] | undefined = [
      {
        date: '',
        close: 0,
      },
    ];

    let key = '';
    let data: ChartData[] = [];

    if (selectedTab === MY_POOL_DETAIL_TABS.EARNINGS) {
      key = 'earnings';
      data = chartData || defaultData;
    } else if (selectedTab === MY_POOL_DETAIL_TABS.SHARE) {
      key = 'share';
      data = chartData || defaultData;
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
    return <div className="no-my-pool-text">Pool couldn't found.</div>;
  } else {
    // const data = calculateChartData(payloadData.pool_chart_data, pool);
    return (
      <div className="my-pool-detail-container">
        <div className="my-pool-detail-main">
          <div className="my-pool-detail-header">
            <div className="my-pool-detail-header-left">
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
            <div className="my-pool-detail-header-right">
              <TabMenu
                menuItems={[MY_POOL_DETAIL_TABS.EARNINGS, MY_POOL_DETAIL_TABS.SHARE]}
                selectedItem={selectedTab}
                onClick={(eventKey: any) => setSelectedTab(eventKey)}
              />
            </div>
          </div>
          <div className="my-pool-detail-content">
            <div className="my-pool-detail-content-right desktop-hidden">{!loading && renderChart()}</div>

            <div className="my-pool-detail-content-left mobile-hidden">
              <div className="my-pool-detail-content-left-header">My pooled assets</div>
              <div className="my-pooled-assets-content">
                <div className="my-pooled-assets-item">
                  <div className="my-pool-detail-img-content">
                    <AssetIcon
                      className="my-pool-detail-img"
                      width="1.5rem"
                      height="1.5rem"
                      asset={pool.quote.assetHash}
                    />
                    {calcPooledAssets().pooledQuote}
                  </div>
                </div>

                <div className="my-pooled-assets-item">
                  <div className="my-pool-detail-img-content">
                    <AssetIcon
                      className="my-pool-detail-img"
                      width="1.5rem"
                      height="1.5rem"
                      asset={pool.token.assetHash}
                    />
                    {calcPooledAssets().pooledToken}
                  </div>
                </div>
              </div>

              <div className="my-pool-detail-content-left-header">My liquidity portion</div>
              <div className="my-pool-detail-item">
                <div className="my-pool-detail-img-content">
                  <span className="portion-item">LP&nbsp;</span>
                  {calcPooledAssets().pooledLp}
                </div>
                <CustomPopover
                  placement="autoHorizontal"
                  title="LP"
                  content="LP tokens represent the assets you deposited into the liquidity pool along with a proportional scale of the trading fees collected over time."
                >
                  <img className="general-icon" src={info} alt="info" />
                </CustomPopover>
              </div>
              <div className="my-pool-detail-item">
                <div className="my-pool-detail-img-content">
                  <span className="portion-item">%&nbsp;</span>
                  {calcPooledAssets().poolRate}
                </div>

                <CustomPopover placement="autoHorizontal" title="%" content="Your liquidity proportion in percentage.">
                  <img className="general-icon" src={info} alt="info" />
                </CustomPopover>
              </div>
              <Button
                appearance="default"
                className="primary-button my-pool-detail-button mt3 mobile-hidden"
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

              <Button
                appearance="default"
                className="primary-button my-pool-detail-button mt3 mobile-hidden"
                onClick={() => {
                  history.push({
                    pathname: ROUTE_PATH.POOL + '/' + pool.id + '/remove-liquidity',
                    state: {
                      from: history.location.pathname,
                    },
                  });
                }}
              >
                Remove Liquidity
              </Button>
            </div>

            <div className="my-pool-detail-content-right mobile-hidden">{!chartLoading && renderChart()}</div>
          </div>
        </div>
      </div>
    );
  }
};
