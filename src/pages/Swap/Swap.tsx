import React from 'react';
import { Button, Content, Divider, Dropdown, Radio, RadioGroup } from 'rsuite';
import lbtc from '../../images/liquid_btc.png';
import usdt from '../../images/tether_usd.png';
import './Swap.scss';

const Swap = () => {
  return (
    <div className="swap-page-main">
      <Content>
        <div className="swap-page-content">
          <div className="from-content pt-2">
            <RadioGroup className="swap-amount-rate" name="radioList" inline appearance="picker">
              <Radio className="left-radio-item" value="A">
                ALL
              </Radio>
              <Radio className="middle-radio-item" value="B">
                HALF
              </Radio>
              <Radio className="right-radio-item" value="C">
                MIN
              </Radio>
            </RadioGroup>
            <div className="from-amount-div">
              <div className="from-text">From</div>
              <input
                className="from-input"
                inputMode="decimal"
                autoComplete="off"
                autoCorrect="off"
                type="text"
                pattern="^[0-9]*[.,]?[0-9]*$"
                placeholder="0.0"
                min="1"
                max="79"
                spellCheck="false"
              />
            </div>
            <div className="from-selection">
              <Dropdown
                title={
                  <div className="swap-dropdown-item">
                    <img className="swap-dropdown-item-img" src={lbtc} />
                    <span>L-BTC</span>
                  </div>
                }
                activeKey="a"
              >
                <Dropdown.Item eventKey="a">
                  {
                    <div className="swap-dropdown-item">
                      <img className="swap-dropdown-item-img" src={usdt} />
                      <span>USDT</span>
                    </div>
                  }
                </Dropdown.Item>
              </Dropdown>
            </div>
          </div>
          <div className="swap-arrow-icon">
            <svg width="1.25rem" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-down" role="img" viewBox="0 0 448 512">
              <path
                fill="currentColor"
                d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z"
              ></path>
            </svg>
          </div>
          <div className="from-content">
            <div className="from-amount-div">
              <div className="from-text">From</div>
              <input
                className="from-input"
                inputMode="decimal"
                autoComplete="off"
                autoCorrect="off"
                type="text"
                pattern="^[0-9]*[.,]?[0-9]*$"
                placeholder="0.0"
                min="1"
                max="79"
                spellCheck="false"
              />
            </div>
            <div className="from-selection">
              <Dropdown
                title={
                  <div className="swap-dropdown-item">
                    <img className="swap-dropdown-item-img" src={lbtc} />
                    <span>USDT</span>
                  </div>
                }
                activeKey="a"
              >
                <Dropdown.Item eventKey="a">
                  {
                    <div className="swap-dropdown-item">
                      <img className="swap-dropdown-item-img" src={lbtc} />
                      <span>L-BTC</span>
                    </div>
                  }
                </Dropdown.Item>
              </Dropdown>
            </div>
          </div>
          <Button appearance="default" className="swap-button" onClick={() => {}}>
            Swap
          </Button>
        </div>
      </Content>
    </div>
  );
};

export default Swap;
