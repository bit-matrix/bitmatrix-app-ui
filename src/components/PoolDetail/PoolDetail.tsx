import React, { useState } from 'react';
import { Button, Icon, Nav } from 'rsuite';
import { PoolData } from '../../model/PoolData';
import lbtcImage from '../../images/liquid_btc.png';
import usdtImage from '../../images/usdt.png';
import './PoolDetail.scss';

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

export const PoolDetail: React.FC<Props> = ({ back }) => {
  const [selectedTab, setSelectedTab] = useState<PoolDetailTabs>(
    PoolDetailTabs.PRICE,
  );

  return (
    <div className="pool-detail-main">
      <div className="pool-detail-header">
        <div className="pool-detail-header-left">
          <a className="pool-detail-button" onClick={back}>
            <Icon
              className="pool-detail-back-icon"
              icon="angle-left"
              size="4x"
            />
          </a>
          <div className="pool-detail-page-text">L-BTC/USDT</div>
        </div>
        <Nav
          activeKey={selectedTab}
          onSelect={(eventKey: any) => setSelectedTab(eventKey)}
          className="pool-detail-tabs"
          appearance="subtle"
        >
          <Nav.Item
            className="pool-detail-navbar-item"
            eventKey={PoolDetailTabs.PRICE}
          >
            Price
          </Nav.Item>
          <Nav.Item
            className="pool-detail-navbar-item"
            eventKey={PoolDetailTabs.VOLUME}
          >
            Volume
          </Nav.Item>
          <Nav.Item
            className="pool-detail-navbar-item"
            eventKey={PoolDetailTabs.LIQUIDITY}
          >
            Liquidity
          </Nav.Item>
          <Nav.Item
            className="pool-detail-navbar-item"
            eventKey={PoolDetailTabs.FEES}
          >
            Fees
          </Nav.Item>
        </Nav>
      </div>
      <div className="pool-detail-content">
        <div className="pool-detail-content-left">
          <div>Pool Pairs</div>
          <div className="pool-detail-item">
            <div className="pool-detail-img-content">
              <img className="pool-detail-img" src={lbtcImage} alt="" />
              <span>L-BTC</span>
            </div>
            82.54m
          </div>

          <div className="pool-detail-item">
            <div className="pool-detail-img-content">
              <img className="pool-detail-img" src={usdtImage} alt="" />
              <span>USDT</span>
            </div>
            123.41k
          </div>

          <div className="pool-detail-volume-fee">
            <div>
              <div>Price</div>
              <div>%12</div>
              <div>1.35%</div>
            </div>

            <div>
              <div>Volume 24h</div>
              <div>%219.20m</div>
              <div>74.53%</div>
            </div>
          </div>

          <Button
            appearance="default"
            className="primary-button"
            onClick={() => {
              console.log('add liquidity');
            }}
          >
            Add Liquidity
          </Button>
        </div>
        <div className="pool-detail-content-right"></div>
      </div>
    </div>
  );
};
