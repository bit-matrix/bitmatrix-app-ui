import React, { useState } from 'react';
import { Icon, IconButton, Nav } from 'rsuite';
import { PoolCard } from '../../components/PoolCard/PoolCard';
import { PoolMockData } from '../../data/PoolMockData';
import { ROUTE_PATH_TITLE } from '../../enum/ROUTE_PATH.TITLE';
import { PoolData } from '../../model/PoolData';
import './Pool.scss';

enum PoolTabs {
  TOP_POOLS = 'top_pools',
  MY_POOLS = 'my_pools',
}

export const Pool = () => {
  const [selectedTab, setSelectedTab] = useState<PoolTabs>(PoolTabs.TOP_POOLS);

  document.title = ROUTE_PATH_TITLE.POOL;

  const getPoolData = () => {
    if (selectedTab == PoolTabs.TOP_POOLS) {
      return PoolMockData.map((poolData) => {
        return (
          <div key={poolData.rank} className="pool-page-card">
            <PoolCard data={poolData} onClick={() => console.log('xxx')} />
          </div>
        );
      });
    } else if (selectedTab == PoolTabs.MY_POOLS) {
      return (
        <div key={PoolMockData[0].rank} className="pool-page-card">
          <PoolCard data={PoolMockData[0]} onClick={() => console.log('xxx')} />
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
          <Nav.Item eventKey={PoolTabs.TOP_POOLS}>Top Pools</Nav.Item>
          <Nav.Item eventKey={PoolTabs.MY_POOLS}>My Pools</Nav.Item>
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
