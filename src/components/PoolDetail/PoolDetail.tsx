import React, { useState } from 'react';
import { Button, Divider, Icon, Nav } from 'rsuite';
import { PoolData } from '../../model/PoolData';
import lbtcImage from '../../images/liquid_btc.png';
import usdtImage from '../../images/usdt.png';
import { ParentSize } from '@visx/responsive';
import AreaChart from '../AreaChart/AreaChart';
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
        <div className="pool-detail-content-right desktop-hidden">
          <ParentSize>
            {({ width, height }) => <AreaChart width={width} height={height} />}
          </ParentSize>
        </div>
        <div className="pool-detail-content-left">
          <div className="pool-detail-content-left-header">Pool Pairs</div>
          <div className="pool-detail-amount">
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
          </div>

          <div className="pool-detail-volume-fee">
            <div className="pool-detail-item">
              <div>Price</div>
              <div>Volume 24h</div>
            </div>
            <div className="pool-detail-item">
              <div className="pool-detail-table-text">%12</div>
              <div className="pool-detail-table-text">%219.20m</div>
            </div>
            <div className="pool-detail-item">
              <div>
                <Icon
                  className="pool-detail-arrow-down-icon"
                  icon="arrow-down2"
                />
                <span className="pool-detail-table-arrow-down-text">1.35%</span>
              </div>
              <div>
                <Icon className="pool-detail-arrow-up-icon" icon="arrow-up2" />
                <span className="pool-detail-table-arrow-up-text">74.54%</span>
              </div>
            </div>
          </div>

          <div className="pool-detail-volume-fee">
            <div className="pool-detail-item">
              <div>TVL</div>
              <div>Fees 24h</div>
            </div>
            <div className="pool-detail-item">
              <div className="pool-detail-table-text">$357.77m</div>
              <div className="pool-detail-table-text">%657.61k</div>
            </div>
            <div className="pool-detail-item">
              <div>
                <Icon
                  className="pool-detail-arrow-down-icon"
                  icon="arrow-down2"
                />
                <span className="pool-detail-table-arrow-down-text">1.35%</span>
              </div>
              <div>
                <Icon className="pool-detail-arrow-up-icon" icon="arrow-up2" />
                <span className="pool-detail-table-arrow-up-text">74.54%</span>
              </div>
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
        <div className="pool-detail-content-right mobile-hidden">
          <ParentSize>
            {({ width, height }) => <AreaChart width={width} height={height} />}
          </ParentSize>
        </div>
      </div>
    </div>
  );
};
