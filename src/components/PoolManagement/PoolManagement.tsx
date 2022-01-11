/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ROUTE_PATH } from '../../enum/ROUTE_PATH';
import { POOL_MANAGEMENT_TABS } from '../../enum/POOL_MANAGEMENT_TABS';
import { Button, Icon, IconButton } from 'rsuite';
import { TabMenu } from '../TabMenu/TabMenu';
import Backdrop from '../Backdrop/Backdrop';
import { Pool } from '@bitmatrix/models';
import { PoolCard } from '../PoolCard/PoolCard';
import { IWallet } from '../../lib/wallet/IWallet';
import { detectProvider } from 'marina-provider';
import { Wallet } from '../../lib/wallet';
import './PoolManagement.scss';

type Props = {
  pools: Pool[];
  onClick: (poolId: string) => void;
};

export const PoolManagement: React.FC<Props> = ({ pools, onClick }) => {
  const [selectedTab, setSelectedTab] = useState<POOL_MANAGEMENT_TABS>(POOL_MANAGEMENT_TABS.TOP_POOLS);
  const [showButtons, setShowButtons] = useState<boolean>(false);
  const [wallet, setWallet] = useState<IWallet>();
  const [myPools, setMyPools] = useState<Pool[]>([]);

  const history = useHistory();

  useEffect(() => {
    detectProvider('marina')
      .then((marina) => {
        const marinaWallet = new Wallet();
        setWallet(marinaWallet);
      })
      .catch(() => {
        const marinaWallet = new Wallet();
        setWallet(marinaWallet);
      });
  }, []);

  useEffect(() => {
    if (pools && pools.length > 0 && wallet && selectedTab === POOL_MANAGEMENT_TABS.MY_POOLS) {
      wallet.getBalances().then((balances) => {
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
  }, [wallet, pools, selectedTab]);

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
                history.push(ROUTE_PATH.ADD_LIQUIDTY);
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
      </div>
      <div className="pool-page-content">
        <div className={`${selectedTab == POOL_MANAGEMENT_TABS.TOP_POOLS ? 'tab-1' : 'tab-2'}`}>{getPoolData()}</div>
      </div>
    </div>
  );
};
