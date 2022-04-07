import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { convertion } from '@bitmatrix/lib';
import { Pool } from '@bitmatrix/models';
import { usePoolChartDataContext, usePoolContext, useSettingsContext, useWalletContext } from '../../../context';
import { ROUTE_PATH } from '../../../enum/ROUTE_PATH';
// import { calculateChartData } from '../../../components/utils/utils';
import { Button } from 'rsuite';
import { ParentSize } from '@visx/responsive';
import AreaChart, { ChartData } from '../../../components/AreaChart/AreaChart';
import { TabMenu } from '../../../components/TabMenu/TabMenu';
import { MY_POOL_DETAIL_TABS } from '../../../enum/MY_POOL_DETAIL_TABS';
import { PREFERRED_UNIT_VALUE } from '../../../enum/PREFERRED_UNIT_VALUE';
import { CustomPopover } from '../../../components/CustomPopover/CustomPopover';
import info from '../../../images/info2.png';
import Decimal from 'decimal.js';
import { BackButton } from '../../../components/base/BackButton/BackButton';
import Numeral from 'numeral';
import LbtcIcon from '../../../components/base/Svg/Icons/Lbtc';
import TetherIcon from '../../../components/base/Svg/Icons/Tether';
import { poolShareRound, quoteAmountRound } from '../../../helper';
import './MyPoolDetail.scss';
import { Helmet } from 'react-helmet';

export const MyPoolDetail: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<MY_POOL_DETAIL_TABS>(MY_POOL_DETAIL_TABS.EARNINGS);
  const [pool, setPool] = useState<Pool>();
  const [loading, setLoading] = useState(true);

  const { poolsContext } = usePoolContext();
  const { walletContext } = useWalletContext();
  const { settingsContext } = useSettingsContext();
  const { poolChartDataContext } = usePoolChartDataContext();

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

  const calcPooledAssets = () => {
    if (poolsContext && poolsContext.length > 0 && walletContext) {
      const currentPool = poolsContext[0];

      const lpAssetId = currentPool.lp.asset;
      const lpAmountInWallet = walletContext.balances.find((bl) => bl.asset.assetHash === lpAssetId)?.amount;
      const lpAmountInWalletN = new Decimal(lpAmountInWallet || 0).ceil().toNumber();

      const quoteTokenRecipients = convertion.calcRemoveLiquidityRecipientValue(currentPool, lpAmountInWalletN);

      const recipientValue = convertion.calcAddLiquidityRecipientValue(
        currentPool,
        quoteTokenRecipients.user_lbtc_received,
        quoteTokenRecipients.user_token_received,
      );

      const pooledQuote = quoteAmountRound(
        quoteTokenRecipients.user_lbtc_received / settingsContext.preferred_unit.value,
      );

      const pooledToken = Numeral(quoteTokenRecipients.user_token_received / PREFERRED_UNIT_VALUE.LBTC).format(
        '(0.00a)',
      );
      const pooledLp = (lpAmountInWalletN / PREFERRED_UNIT_VALUE.LBTC).toFixed(8);
      const poolRate = poolShareRound(Number(recipientValue.poolRate) * 100);

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
    const data: ChartData[] = [
      {
        date: new Date().toLocaleDateString(),
        close: 0,
      },
    ];

    let key = '';

    if (selectedTab === MY_POOL_DETAIL_TABS.EARNINGS) {
      key = 'earnings';
      data;
      // data = allData.allPriceData;
    } else if (selectedTab === MY_POOL_DETAIL_TABS.SHARE) {
      key = 'share';
      data;
      // data = allData.allVolumeData;
    }

    return (
      <ParentSize key={key}>
        {({ width, height }) => <AreaChart width={width} height={height} data={data} />}
      </ParentSize>
    );
  };

  if (pool === undefined || poolChartDataContext === undefined) {
    return <div className="no-my-pool-text">Pool couldn't found.</div>;
  } else {
    // const data = calculateChartData(payloadData.pool_chart_data, pool);
    return (
      <div className="my-pool-detail-container">
        <Helmet>
          <meta property="og:url" content={`https://dev.bitmatrix.app/pool/my-pool/${pool.id}`} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="MyPool" />
          <meta property="og:description" content="Swap assets, add liquidity, and view tL-BTC/tL-USDt pool metrics." />
          <meta property="og:image" content="https://picsum.photos/200" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta property="twitter:domain" content={`https://dev.bitmatrix.app/pool/my-pool/${pool.id}`} />
          <meta property="twitter:url" content={`https://dev.bitmatrix.app/pool/my-pool/${pool.id}`} />
          <meta name="twitter:title" content="Bitmatrix tL-BTC/tL-USDt Liquidity Pool" />
          <meta
            name="twitter:description"
            content="Swap assets, add liquidity, and view tL-BTC/tL-USDt pool metrics."
          />
          <meta name="twitter:image" content="https://picsum.photos/200" />
        </Helmet>
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
                    <LbtcIcon className="my-pool-detail-img" width="1.5rem" height="1.5rem" />
                    {calcPooledAssets().pooledQuote}
                  </div>
                </div>

                <div className="my-pooled-assets-item">
                  <div className="my-pool-detail-img-content">
                    <TetherIcon className="my-pool-detail-img" width="1.5rem" height="1.5rem" />
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

            <div className="my-pool-detail-content-right mobile-hidden">{!loading && renderChart()}</div>
          </div>
        </div>
      </div>
    );
  }
};
