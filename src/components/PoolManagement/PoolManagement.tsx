/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Icon, IconButton } from 'rsuite';
import { TabMenu } from '../TabMenu/TabMenu';
import { POOL_MANAGEMENT_TABS } from '../../enum/POOL_MANAGEMENT_TABS';
import { Pool } from '@bitmatrix/models';
import { PoolCard } from '../PoolCard/PoolCard';
import './PoolManagement.scss';

type Props = {
  pools: Pool[];
  onClick: (data: Pool) => void;
};

export const PoolManagement: React.FC<Props> = ({ pools, onClick }) => {
  const [selectedTab, setSelectedTab] = useState<POOL_MANAGEMENT_TABS>(
    POOL_MANAGEMENT_TABS.TOP_POOLS,
  );

  const getPoolData = () => {
    if (selectedTab == POOL_MANAGEMENT_TABS.TOP_POOLS) {
      return pools.map((pool, index) => {
        return (
          <div key={pool.id} className="pool-page-card card-1">
            <PoolCard
              pool={pool}
              rank={index + 1}
              onClick={() => onClick(pool)}
            />
          </div>
        );
      });
    } else if (selectedTab == POOL_MANAGEMENT_TABS.MY_POOLS) {
      return (
        <div key={1} className="pool-page-card card-2">
          <PoolCard
            pool={pools[0]}
            rank={1}
            onClick={() => onClick(pools[0])}
          />
        </div>
      );
    }
  };

  return (
    <div className="pool-page-main">
      <div className="pool-page-header">
        <IconButton
          className="pool-page-button"
          icon={<Icon className="pool-page-icon" icon="sliders" size="4x" />}
        />
        <TabMenu
          menuItems={[
            POOL_MANAGEMENT_TABS.TOP_POOLS,
            POOL_MANAGEMENT_TABS.MY_POOLS,
          ]}
          selectedItem={selectedTab}
          onClick={(eventKey: any) => setSelectedTab(eventKey)}
        />
        <IconButton
          className="pool-page-button"
          icon={<Icon className="pool-page-icon" icon="plus" size="4x" />}
        />
      </div>
      <div className="pool-page-content">
        <div
          className={`${
            selectedTab == POOL_MANAGEMENT_TABS.TOP_POOLS ? 'tab-1' : 'tab-2'
          }`}
        >
          {getPoolData()}
        </div>
      </div>
    </div>
  );
};
