import React, { useState } from 'react';
import { Icon, IconButton, Nav } from 'rsuite';
import { PoolData } from '../../model/PoolData';

enum PoolDetailTabs {
  PRICE = 'price',
  VOLUME = 'volume',
  LIQUIDITY = 'liquidity',
  FEES = 'fees',
}

type Props = {
  back: () => void;
  poolData: PoolData;
};

export const PoolDetail: React.FC<Props> = ({ back, poolData }) => {
  const [selectedTab, setSelectedTab] = useState<PoolDetailTabs>(
    PoolDetailTabs.PRICE,
  );

  return (
    <div className="pool-detail-page-main">
      <div className="pool-page-header">
        <IconButton
          className="pool-detail-page-button"
          onClick={back}
          icon={
            <Icon
              className="pool-detail-page-icon"
              icon="angle-left"
              size="4x"
            />
          }
        />
        <Nav
          activeKey={selectedTab}
          onSelect={(eventKey: any) => setSelectedTab(eventKey)}
          className="pool-detail-page-tabs"
          appearance="subtle"
        >
          <Nav.Item eventKey={PoolDetailTabs.PRICE}>Price</Nav.Item>
          <Nav.Item eventKey={PoolDetailTabs.VOLUME}>Volume</Nav.Item>
          <Nav.Item eventKey={PoolDetailTabs.LIQUIDITY}>Liquidity</Nav.Item>
          <Nav.Item eventKey={PoolDetailTabs.FEES}>Fees</Nav.Item>
        </Nav>
      </div>
      <div className="pool-detail-page-content">detay</div>
    </div>
  );
};
