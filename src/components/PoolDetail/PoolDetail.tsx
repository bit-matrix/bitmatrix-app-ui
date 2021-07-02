import React, { useState } from 'react';
import { Button, Icon, Nav } from 'rsuite';
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
        <div className="pool-detail-content-left">
          <div>Pool Pairs</div>
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
            <table className="pool-detail-table">
              <tr>
                <th>Price</th>
                <th>Volume 24h</th>
              </tr>
              <tr>
                <td className="pool-detail-table-text">%12</td>
                <td className="pool-detail-table-text">%219.20m</td>
              </tr>
              <tr>
                <td>
                  <Icon
                    className="pool-detail-arrow-down-icon"
                    icon="long-arrow-down"
                  />
                  <span className="pool-detail-table-arrow-down-text">
                    1.35%
                  </span>
                </td>
                <td>
                  <Icon
                    className="pool-detail-arrow-up-icon"
                    icon="long-arrow-up"
                  />
                  <span className="pool-detail-table-arrow-up-text">
                    74.54%
                  </span>
                </td>
              </tr>
            </table>
          </div>

          <div className="pool-detail-volume-fee">
            <table className="pool-detail-table">
              <tr>
                <th>TVL</th>
                <th>Fees 24h</th>
              </tr>
              <tr>
                <td className="pool-detail-table-text">$357.77m</td>
                <td className="pool-detail-table-text">%657.61k</td>
              </tr>
              <tr>
                <td>
                  <Icon
                    className="pool-detail-arrow-down-icon"
                    icon="long-arrow-down"
                  />
                  <span className="pool-detail-table-arrow-down-text">
                    1.35%
                  </span>
                </td>
                <td>
                  <Icon
                    className="pool-detail-arrow-up-icon"
                    icon="long-arrow-up"
                  />
                  <span className="pool-detail-table-arrow-up-text">
                    74.54%
                  </span>
                </td>
              </tr>
            </table>
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
        <div className="pool-detail-content-right">
          <ParentSize>
            {({ width, height }) => <AreaChart width={width} height={height} />}
          </ParentSize>
        </div>
      </div>
    </div>
  );
};
