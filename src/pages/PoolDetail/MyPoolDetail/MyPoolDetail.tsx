import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { api, convertion } from '@bitmatrix/lib';
import { BmChart, Pool } from '@bitmatrix/models';
import { ROUTE_PATH } from '../../../enum/ROUTE_PATH';
import { calculateChartData } from '../../../components/utils/utils';
import { Button, Loader } from 'rsuite';
import { ParentSize } from '@visx/responsive';
import AreaChart, { ChartData } from '../../../components/AreaChart/AreaChart';
import { TabMenu } from '../../../components/TabMenu/TabMenu';
import { MY_POOL_DETAIL_TABS } from '../../../enum/MY_POOL_DETAIL_TABS';
import { PREFERRED_UNIT_VALUE } from '../../../enum/PREFERRED_UNIT_VALUE';
import SettingsContext from '../../../context/SettingsContext';
import { CustomPopover } from '../../../components/CustomPopover/CustomPopover';
import info from '../../../images/info2.png';
import lbtcImage from '../../../images/liquid_btc.png';
import usdtImage from '../../../images/usdt.png';
import Decimal from 'decimal.js';
import { BackButton } from '../../../components/base/BackButton/BackButton';
import './MyPoolDetail.scss';
import Numeral from 'numeral';

export const MyPoolDetail: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<MY_POOL_DETAIL_TABS>(MY_POOL_DETAIL_TABS.EARNINGS);
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

  const calcPooledAssets = () => {
    if (payloadData.pools && payloadData.pools.length > 0 && payloadData.wallet) {
      const currentPool = payloadData.pools[0];

      const lpAssetId = currentPool.lp.asset;
      const lpAmountInWallet = payloadData.wallet.balances.find((bl) => bl.asset.assetHash === lpAssetId)?.amount;
      const lpAmountInWalletN = new Decimal(lpAmountInWallet || 0).ceil().toNumber();

      const quoteTokenRecipients = convertion.calcRemoveLiquidityRecipientValue(currentPool, lpAmountInWalletN);

      const recipientValue = convertion.calcAddLiquidityRecipientValue(
        currentPool,
        quoteTokenRecipients.user_lbtc_received,
        quoteTokenRecipients.user_token_received,
      );

      const pooledQuote = Numeral(quoteTokenRecipients.user_lbtc_received / payloadData.preferred_unit.value).format(
        '(0.00a)',
      );
      const pooledToken = Numeral(quoteTokenRecipients.user_token_received / PREFERRED_UNIT_VALUE.LBTC).format(
        '(0.00a)',
      );
      const pooledLp = (lpAmountInWalletN / PREFERRED_UNIT_VALUE.LBTC).toFixed(8);
      const poolRate = (Number(recipientValue.poolRate) * 100).toFixed(2);

      return {
        pooledQuote,
        pooledToken,
        pooledLp,
        poolRate,
      };
    }
    return { pooledQuote: '0', pooledToken: '0', pooledLp: '0', poolRate: '0' };
  };

  const renderChart = (allData: any) => {
    let data: ChartData[] = [
      {
        date: '',
        close: 0,
      },
    ];

    let key = '';

    if (selectedTab === MY_POOL_DETAIL_TABS.EARNINGS) {
      key = 'earnings';
      data = allData.allPriceData;
    } else if (selectedTab === MY_POOL_DETAIL_TABS.SHARE) {
      key = 'share';
      data = allData.allVolumeData;
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
    return <div className="no-my-pool-text">Pool couldn't found.</div>;
  } else {
    const data = calculateChartData(chartData, pool);

    return (
      <div className="my-pool-detail-container">
        <div className="my-pool-detail-main">
          <div className="my-pool-detail-header">
            <div className="my-pool-detail-header-left">
              <BackButton />
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
            <div className="my-pool-detail-content-right desktop-hidden">{renderChart(data)}</div>
            <div className="my-pool-detail-content-left">
              <div className="my-pooled-assets">
                <div className="my-pool-detail-content-left-header">My pooled assets</div>
                <div className="my-pooled-assets-content">
                  <div className="my-pooled-assets-item">
                    <div className="my-pool-detail-img-content left-side">
                      <img className="my-pool-detail-img" src={lbtcImage} alt="" />
                      {calcPooledAssets().pooledQuote}
                    </div>
                  </div>

                  <div className="my-pooled-assets-item">
                    <div className="my-pool-detail-img-content left-side">
                      <img className="my-pool-detail-img" src={usdtImage} alt="" />
                      {calcPooledAssets().pooledToken}
                    </div>
                  </div>
                </div>
              </div>

              <div className="my-liquidity-portion">
                <div className="my-pool-detail-content-left-header">My liquidity portion</div>
                <div className="my-pool-detail-item">
                  <div className="my-pool-detail-img-content left-side">
                    <span className="portion-item">LP&nbsp;</span>
                    {calcPooledAssets().pooledLp}
                  </div>
                  <CustomPopover
                    placement="autoHorizontal"
                    title="LP"
                    content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
                  >
                    <img className="general-icon" src={info} alt="info" />
                  </CustomPopover>
                </div>
                <div className="my-pool-detail-item">
                  <div className="my-pool-detail-img-content left-side">
                    <span className="portion-item">%&nbsp;</span>
                    {calcPooledAssets().poolRate}
                  </div>

                  <CustomPopover
                    placement="autoHorizontal"
                    title="%"
                    content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
                  >
                    <img className="general-icon" src={info} alt="info" />
                  </CustomPopover>
                </div>
              </div>
              <div className="my-pool-detail-buttons">
                <Button
                  appearance="default"
                  className="primary-button my-pool-detail-button mt3 mobile-hidden"
                  onClick={() => {
                    history.push(ROUTE_PATH.POOL + '/' + pool.id + '/add-liquidity');
                  }}
                >
                  Add Liquidity
                </Button>

                <Button
                  appearance="default"
                  className="primary-button my-pool-detail-button mobile-hidden"
                  onClick={() => {
                    history.push(ROUTE_PATH.POOL + '/' + pool.id + '/remove-liquidity');
                  }}
                >
                  Remove Liquidity
                </Button>
              </div>
            </div>
            <div className="my-pool-detail-content-right mobile-hidden">{renderChart(data)}</div>
          </div>
        </div>
      </div>
    );
  }
};
