import React from 'react';
import { Button, Icon, IconButton, Nav } from 'rsuite';
import { PoolCard } from '../../components/PoolCard/PoolCard';
import { ROUTE_PATH_TITLE } from '../../enum/ROUTE_PATH.TITLE';
import './Pool.scss';

export const Pool = () => {
  document.title = ROUTE_PATH_TITLE.POOL;
  return (
    <div className="pool-page-main">
      <div className="pool-page-header">
        <IconButton
          className="pool-page-button"
          icon={<Icon className="pool-page-icon" icon="sliders" size="4x" />}
        />
        <Nav className="pool-page-tabs" appearance="subtle">
          <Nav.Item active>Top Pools</Nav.Item>
          <Nav.Item>My Pools</Nav.Item>
        </Nav>
        <IconButton
          className="pool-page-button"
          icon={<Icon className="pool-page-icon" icon="plus" />}
        />
      </div>
      <div className="pool-page-content">
        <div className="pool-page-card">
          <PoolCard />
        </div>
      </div>
    </div>
  );
};
