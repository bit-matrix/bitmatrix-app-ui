/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Button, Content, Dropdown, Radio, RadioGroup } from "rsuite";
import { Icon } from "rsuite";
import lbtc from "../../images/liquid_btc.png";
import usdt from "../../images/usdt.png";
import info from "../../images/info.png";
import bitmatrix_icon from "../../images/bitmatrix_icon.png";
import "./Swap.scss";

const Swap = () => {
  const [selectedTab, setSelectedTab] = useState("swap");

  return (
    <div className="swap-page-main">
      <Content className="swap-page-main-content">
        <img className="bitmatrix-icon" src={bitmatrix_icon} alt="" />
        <div className="swap-page-layout">
          <div className="swap-page-tabs">
            <div onClick={() => setSelectedTab("swap")} className={`swap-page-tab-left ${selectedTab === "swap" ? "selected" : ""}`}>
              <span>Swap</span>
            </div>
            <div className="swap-page-tab-middle"></div>
            <div onClick={() => setSelectedTab("pool")} className={`swap-page-tab-right ${selectedTab === "pool" ? "selected" : ""}`}>
              <span>Pool</span>
            </div>
          </div>
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
                        <img className="swap-dropdown-item-img" src={usdt} style={{ height: "1.65rem" }} />
                        <span>USDT</span>
                      </div>
                    }
                  </Dropdown.Item>
                </Dropdown>
              </div>
            </div>
            <div className="swap-arrow-icon">
              <svg width="1.05rem" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-down" role="img" viewBox="0 0 448 512">
                <path
                  fill="currentColor"
                  d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z"
                ></path>
              </svg>
            </div>
            <div className="from-content">
              <div className="from-amount-div">
                <div className="from-text">To</div>
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
                      <img className="swap-dropdown-item-img" src={usdt} style={{ height: "1.65rem" }} />
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

          <div id="wrap" className="swap-footer-tab">
            <div id="one" className="swap-footer-tab-one">
              <img className="info-img" src={info} alt="" />
            </div>
            <div id="two" className="swap-footer-tab-two">
              Network fee 0.1sat/byte $0.12
            </div>
          </div>
        </div>
      </Content>

      <div className="swap-page-footer">
        <div className="swap-page-footer-icons">
          <a className="swap-page-footer-icon-item">
            <Icon className="swap-page-footer-icon" icon="medium" />
          </a>
          <a href="https://twitter.com/bitmatrix_" className="swap-page-footer-icon-item">
            <Icon className="swap-page-footer-icon" icon="twitter" />
          </a>
          <a href="https://t.me/bitmatrix_community" className="swap-page-footer-icon-item">
            <Icon className="swap-page-footer-icon" icon="telegram" />
          </a>
          <a href="https://github.com/bit-matrix" className="swap-page-footer-icon-item">
            <Icon className="swap-page-footer-icon" icon="github" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Swap;
