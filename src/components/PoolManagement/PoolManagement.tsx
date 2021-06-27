import React, { useState } from 'react';
import { Icon, IconButton, Nav } from 'rsuite';
import { PoolCard } from '../../components/PoolCard/PoolCard';
import { PoolMockData } from '../../data/PoolMockData';
import { PoolData } from '../../model/PoolData';
import './PoolManagement.scss';

type Props = {
  onClick: (data: PoolData) => void;
};

enum PoolManagementTabs {
  TOP_POOLS = 'top_pools',
  MY_POOLS = 'my_pools',
}

export const PoolManagement: React.FC<Props> = ({ onClick }) => {
  const [selectedTab, setSelectedTab] = useState<PoolManagementTabs>(
    PoolManagementTabs.TOP_POOLS,
  );

  const getPoolData = () => {
    if (selectedTab == PoolManagementTabs.TOP_POOLS) {
      return PoolMockData.map((poolData) => {
        return (
          <div key={poolData.rank} className="pool-page-card">
            <PoolCard data={poolData} onClick={() => onClick(poolData)} />
          </div>
        );
      });
    } else if (selectedTab == PoolManagementTabs.MY_POOLS) {
      return (
        <div key={PoolMockData[0].rank} className="pool-page-card">
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
        <Nav
          activeKey={selectedTab}
          onSelect={(eventKey: any) => setSelectedTab(eventKey)}
          className="pool-page-tabs"
          appearance="subtle"
        >
          <Nav.Item eventKey={PoolManagementTabs.TOP_POOLS}>Top Pools</Nav.Item>
          <Nav.Item eventKey={PoolManagementTabs.MY_POOLS}>My Pools</Nav.Item>
        </Nav>
        <IconButton
          className="pool-page-button"
          icon={<Icon className="pool-page-icon" icon="plus" />}
        />
      </div>
      <div className="pool-page-content">{getPoolData()}</div>
    </div>
  );
};
