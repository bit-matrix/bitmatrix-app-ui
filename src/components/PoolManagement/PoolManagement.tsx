/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ROUTE_PATH } from '../../enum/ROUTE_PATH';
import { POOL_MANAGEMENT_TABS } from '../../enum/POOL_MANAGEMENT_TABS';
import { Button, Icon, IconButton, Modal } from 'rsuite';
import { TabMenu } from '../TabMenu/TabMenu';
import Backdrop from '../Backdrop/Backdrop';
import { Pool } from '@bitmatrix/models';
import { PoolCard } from '../PoolCard/PoolCard';
import SettingsContext from '../../context/SettingsContext';
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

  const history = useHistory();

  useEffect(() => {
    if (pools && pools.length > 0 && payloadData.wallet?.marina && selectedTab === POOL_MANAGEMENT_TABS.MY_POOLS) {
      payloadData.wallet.marina.getBalances().then((balances) => {
        const balanceAssets = balances.map((bl) => bl.asset.assetHash);
        const myCurrentPools: Pool[] = [];

        balanceAssets.forEach((ba) => {
          const currentPool = pools.find((po) => po.lp.asset === ba);

          if (currentPool) {
            myCurrentPools.push(currentPool);
          }
        });

        setMyPools(myCurrentPools);
      });
    }
  }, [payloadData.wallet?.marina, pools, selectedTab]);

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
              onClick={(poolId: string) => history.push(ROUTE_PATH.POOL + '/my-pool/' + poolId)}
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
        show={showPoolListModal}
        onHide={() => setShowPoolListModal(false)}
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
                    onClick={() => history.push('pool/' + pool.id + '/add-liquidity')}
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
    <div className="pool-page-main">
      <div className="pool-page-header">
        <IconButton className="pool-page-button" icon={<Icon className="pool-page-icon" icon="sliders" size="4x" />} />

        <TabMenu
          menuItems={[POOL_MANAGEMENT_TABS.TOP_POOLS, POOL_MANAGEMENT_TABS.MY_POOLS]}
          selectedItem={selectedTab}
          onClick={(eventKey: any) => setSelectedTab(eventKey)}
        />
        <IconButton
          className="pool-page-button"
          onClick={() => setShowButtons(!showButtons)}
          icon={<Icon className="pool-page-icon" icon="plus" size="4x" />}
        />
        {showButtons && addButtons()}
        {showPoolListModal && poolListModal()}
      </div>
      <div className="pool-page-content">
        <div className={`${selectedTab == POOL_MANAGEMENT_TABS.TOP_POOLS ? 'tab-1' : 'tab-2'}`}>{getPoolData()}</div>
      </div>
    </div>
  );
};
