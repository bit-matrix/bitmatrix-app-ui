/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Button, Content, Toggle } from 'rsuite';
import pentacle from '../images/pentacle.png';
import btcIcon from '../images/btcicon.png';
import './Swap.scss';

const Swap = () => {
  return (
    <div className="swap-main-div">
      <Navbar />

      <Content>
        <div className="content">
          <img className="pentacle-icon" src={pentacle} alt="" />
          <div className="layout">
            <div className="btc-main-div">
              <div className="you-are-exchanging">You are exchanging</div>
              <div className="btc-context">
                <div className="btc-input">
                  <input
                    className="input input-btc"
                    inputMode="decimal"
                    autoComplete="off"
                    autoCorrect="off"
                    type="text"
                    pattern="^[0-9]*[.,]?[0-9]*$"
                    placeholder="0.0"
                    min="1"
                    max="79"
                    spellCheck="false"
                  ></input>
                  <div className="bitcoin-div">
                    <img className="btc-image" src={btcIcon} />
                    <div className="btc">BTC</div>
                  </div>
                </div>

                <div className="divider" />
                <div className="usd-div">
                  <input
                    className="input input-usd"
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
                  <div className="usd">USD</div>
                </div>
              </div>
            </div>

            <div className="arrow-icon">
              <svg width="1.5rem" height="1.5rem" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-down" role="img" viewBox="0 0 448 512">
                <path
                  fill="currentColor"
                  d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z"
                ></path>
              </svg>
            </div>

            <div className="token-main-div">
              <div className="you-are-exchanging">You will receive</div>
              <div className="select-token">Select a token</div>
            </div>
          </div>
          <div className="bottom-main-div">
            <div className="bottom-text">
              <span className="bottom-text-span"> *All on-chain and liquidity provider fees are included.</span>
            </div>
            <div>
              <Button appearance="default" className="button" onClick={() => {}}>
                Swap
              </Button>
            </div>
          </div>
        </div>
      </Content>
    </div>
  );
};

export default Swap;
