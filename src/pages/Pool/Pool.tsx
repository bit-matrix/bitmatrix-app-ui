/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { usePoolContext, useWalletContext } from '../../context';
import { api } from '@bitmatrix/lib';
import { ROUTE_PATH } from '../../enum/ROUTE_PATH';
import { POOL_MANAGEMENT_TABS } from '../../enum/POOL_MANAGEMENT_TABS';
import { Button, Modal } from 'rsuite';
import { Pool, ChartSummary } from '@bitmatrix/models';
import { ROUTE_PATH_TITLE } from '../../enum/ROUTE_PATH.TITLE';
import { PoolCard } from '../../components/PoolCard/PoolCard';
import Backdrop from '../../components/Backdrop/Backdrop';
import SliderIcon from '../../components/base/Svg/Icons/Slider';
import { TabMenu } from '../../components/base/TabMenu/TabMenu';
import AddIcon from '../../components/base/Svg/Icons/Add';
import './Pool.scss';

export const PoolPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<POOL_MANAGEMENT_TABS>(POOL_MANAGEMENT_TABS.TOP_POOLS);
  const [showButtons, setShowButtons] = useState<boolean>(false);
  const [showPoolListModal, setShowPoolListModal] = useState<boolean>(false);
  const [myPools, setMyPools] = useState<Pool[]>([]);
  const [chartSummaries, setChartSummeries] = useState<ChartSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { walletContext } = useWalletContext();
  const { poolsContext } = usePoolContext();

  const history = useHistory();

  document.title = ROUTE_PATH_TITLE.POOL;

  const [poolContainerClasses, setPoolContainerClasses] = useState(['pool-page-main']);

  useEffect(() => {
    const poolIds = poolsContext.map((pc) => pc.id);
    api.getPoolChartDatas(poolIds).then((chartDatas) => {
      setChartSummeries(chartDatas);
      setLoading(false);
    });
  }, [poolsContext]);

  useEffect(() => {
    const prevPage = history.location.state;

    if (prevPage) {
      const fromLocation = (prevPage as { from: string }).from;

      if (
        fromLocation.startsWith('/pool') &&
        !fromLocation.includes('add-liquidity') &&
        !fromLocation.includes('remove-liquidity')
      ) {
        const currentPoolContainerClass = [...poolContainerClasses];
        currentPoolContainerClass.push('pool-shrink');
        setPoolContainerClasses(currentPoolContainerClass);
        //  poolContainerClasses.push('pool-shrink');
        if (fromLocation.startsWith('/pool/my-pool')) {
          setSelectedTab(POOL_MANAGEMENT_TABS.MY_POOLS);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (poolsContext && poolsContext.length > 0 && walletContext && selectedTab === POOL_MANAGEMENT_TABS.MY_POOLS) {
      const balanceAssets = walletContext?.balances.filter((bl) => bl.amount > 0).map((bl) => bl.asset.assetHash);
      const myCurrentPools: Pool[] = [];

      balanceAssets.forEach((ba) => {
        const currentPool = poolsContext.find((po) => po.lp.assetHash === ba);

        if (currentPool) {
          myCurrentPools.push(currentPool);
        }
      });

      setMyPools(myCurrentPools);
    }
  }, [walletContext?.balances, poolsContext, selectedTab]);

  const getPoolData = () => {
    if (selectedTab == POOL_MANAGEMENT_TABS.TOP_POOLS) {
      return poolsContext.map((pool, index) => {
        return (
          <div key={pool.id} className="pool-page-card card-1">
            <PoolCard
              pool={pool}
              chartSummary={chartSummaries.find((cs) => cs.poolId === pool.id)}
              rank={index + 1}
              onClick={() =>
                history.push({
                  pathname: ROUTE_PATH.POOL + '/' + pool.id,
                  state: {
                    from: history.location.pathname,
                  },
                })
              }
            />
          </div>
        );
      });
    } else if (selectedTab == POOL_MANAGEMENT_TABS.MY_POOLS) {
      if (myPools.length === 0) {
        return <div className="no-pool-text">No pool found.</div>;
      }

      return myPools.map((pool, index) => {
        return (
          <div key={pool.id} className="pool-page-card card-2">
            <PoolCard
              pool={pool}
              chartSummary={chartSummaries.find((cs) => cs.poolId === pool.id)}
              rank={index + 1}
              onClick={(poolId: string) => {
                history.push({
                  pathname: ROUTE_PATH.POOL + '/my-pool/' + poolId,
                  state: {
                    from: history.location.pathname,
                  },
                });
              }}
            />
          </div>
        );
      });
    }
  };

  const addButtons = (): JSX.Element => {
    return (
      <>
        <Backdrop show={showButtons} clicked={() => setShowButtons(false)} />
        <div className="add-buttons-content">
          <div className="six">
            <Button
              appearance="default"
              className="pm-add-button pm-add-liquidity"
              onClick={() => {
                setShowPoolListModal(!showPoolListModal);
                setShowButtons(false);
              }}
            >
              Add Liquidity
            </Button>
            <Button
              appearance="default"
              className="pm-add-button pm-create-new-pool"
              onClick={() => history.push(ROUTE_PATH.CREATE_NEW_POOL)}
            >
              Create New Pool
            </Button>
          </div>
        </div>
      </>
    );
  };

  const poolListModal = (): JSX.Element => {
    return (
      <Modal
        className="pool-list-modal"
        backdrop={true}
        open={showPoolListModal}
        onClose={() => setShowPoolListModal(false)}
      >
        <Modal.Header>
          <Modal.Title>Choose a pool</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            {poolsContext.map((pool: Pool, index: number) => {
              return (
                <div key={pool.id} className="pool-page-card card-2">
                  <PoolCard
                    pool={pool}
                    chartSummary={chartSummaries.find((cs) => cs.poolId === pool.id)}
                    rank={index + 1}
                    onClick={() => {
                      history.push({
                        pathname: 'pool/' + pool.id + '/add-liquidity',
                        state: {
                          from: history.location.pathname,
                        },
                      });
                    }}
                    showDetail={false}
                  />
                </div>
              );
            })}
          </ul>
        </Modal.Body>
      </Modal>
    );
  };

  if (poolsContext && poolsContext.length > 0 && !loading) {
    return (
      <div className={poolContainerClasses.join(' ')}>
        <div className="pool-page-header">
          <div className="pool-page-button pool-page-icon">
            <SliderIcon width="1.25rem" height="1.5rem" />
          </div>
          <TabMenu
            menuItems={[POOL_MANAGEMENT_TABS.TOP_POOLS, POOL_MANAGEMENT_TABS.MY_POOLS]}
            selectedItem={selectedTab}
            onClick={(eventKey: any) => setSelectedTab(eventKey)}
          />
          <div className="pool-page-button" onClick={() => setShowButtons(!showButtons)}>
            <AddIcon width="1.5rem" height="1.5rem" />
          </div>

          {/* <PlusIcon  onClick={() => setShowButtons(!showButtons)} /> */}

          {showButtons && addButtons()}
          {showPoolListModal && poolListModal()}
        </div>
        <div className="pool-page-content">
          <div className={`${selectedTab == POOL_MANAGEMENT_TABS.TOP_POOLS ? 'tab-1' : 'tab-2'}`}>{getPoolData()}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="pool-page-main">
      <div className="no-pool-text">There are no pools</div>
    </div>
  );
};
