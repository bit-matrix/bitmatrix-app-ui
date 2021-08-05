import React, { useState } from 'react';
import { Icon, IconButton, Nav } from 'rsuite';
import { PoolCard } from '../../components/PoolCard/PoolCard';
import { PoolMockData } from '../../data/PoolMockData';
import { PoolData } from '../../model/PoolData';
import { TabMenu } from '../TabMenu/TabMenu';
import './PoolManagement.scss';

type Props = {
  onClick: (data: PoolData) => void;
};

enum PoolManagementTabs {
  TOP_POOLS = 'Top Pools',
  MY_POOLS = 'My Pools',
}

export const PoolManagement: React.FC<Props> = ({ onClick }) => {
  const [selectedTab, setSelectedTab] = useState<PoolManagementTabs>(
    PoolManagementTabs.TOP_POOLS,
  );

  const getPoolData = () => {
    if (selectedTab == PoolManagementTabs.TOP_POOLS) {
      return PoolMockData.map((poolData) => {
        return (
          <div key={poolData.rank} className="pool-page-card card-1">
            <PoolCard data={poolData} onClick={() => onClick(poolData)} />
          </div>
        );
      });
    } else if (selectedTab == PoolManagementTabs.MY_POOLS) {
      return (
        <div key={PoolMockData[0].rank} className="pool-page-card card-2">
          <PoolCard
            data={PoolMockData[0]}
            onClick={() => onClick(PoolMockData[0])}
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
            PoolManagementTabs.TOP_POOLS,
            PoolManagementTabs.MY_POOLS,
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
            selectedTab == PoolManagementTabs.TOP_POOLS ? 'tab-1' : 'tab-2'
          }`}
        >
          {getPoolData()}
        </div>{' '}
      </div>
      {/* <div className="pool-page-shadow" /> */}
    </div>
  );
};
