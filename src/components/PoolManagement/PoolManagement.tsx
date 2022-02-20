/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ROUTE_PATH } from '../../enum/ROUTE_PATH';
import { POOL_MANAGEMENT_TABS } from '../../enum/POOL_MANAGEMENT_TABS';
import { Button, Modal } from 'rsuite';
import { TabMenu } from '../TabMenu/TabMenu';
import Backdrop from '../Backdrop/Backdrop';
import { Pool } from '@bitmatrix/models';
import { PoolCard } from '../PoolCard/PoolCard';
import SettingsContext from '../../context/SettingsContext';
import SliderIcon from '../base/Svg/Icons/Slider';
import AddIcon from '../base/Svg/Icons/Add';
import './PoolManagement.scss';

type Props = {
  pools: Pool[];
  onClick: (poolId: string) => void;
};

export const PoolManagement: React.FC<Props> = ({ pools, onClick }) => {
  const [selectedTab, setSelectedTab] = useState<POOL_MANAGEMENT_TABS>(POOL_MANAGEMENT_TABS.TOP_POOLS);
  const [showButtons, setShowButtons] = useState<boolean>(false);
  const [showPoolListModal, setShowPoolListModal] = useState<boolean>(false);
  const [myPools, setMyPools] = useState<Pool[]>([]);
  const { payloadData } = useContext(SettingsContext);
  const [poolContainerClasses, setPoolContainerClasses] = useState(['pool-page-main']);
  const history = useHistory();

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
      }
    }
  }, []);

  useEffect(() => {
    if (pools && pools.length > 0 && payloadData.wallet && selectedTab === POOL_MANAGEMENT_TABS.MY_POOLS) {
      const balanceAssets = payloadData.wallet?.balances.map((bl) => bl.asset.assetHash);
      const myCurrentPools: Pool[] = [];

      balanceAssets.forEach((ba) => {
        const currentPool = pools.find((po) => po.lp.asset === ba);

        if (currentPool) {
          myCurrentPools.push(currentPool);
        }
      });

      setMyPools(myCurrentPools);
    }
  }, [payloadData.wallet?.balances, pools, selectedTab]);

  const getPoolData = () => {
    if (selectedTab == POOL_MANAGEMENT_TABS.TOP_POOLS) {
      return pools.map((pool, index) => {
        return (
          <div key={pool.id} className="pool-page-card card-1">
            <PoolCard pool={pool} rank={index + 1} onClick={() => onClick(pool.id)} />
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
              onClick={() => console.log('create new pool')}
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
            {pools.map((pool: Pool, index: number) => {
              return (
                <div key={pool.id} className="pool-page-card card-2">
                  <PoolCard
                    pool={pool}
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
};
