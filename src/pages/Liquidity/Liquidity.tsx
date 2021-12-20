import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import FROM_AMOUNT_PERCENT from '../../enum/FROM_AMOUNT_PERCENT';
import { SwapFromTab } from '../../components/SwapFromTab/SwapFromTab';
import { Button, Content, Icon } from 'rsuite';
import SWAP_ASSET from '../../enum/SWAP_ASSET';
import lp from '../../images/lp.png';
import pct from '../../images/pct.png';
import rew from '../../images/rew.png';
import plus from '../../images/plus.png';
import btc from '../../images/liquid_btc.png';
import usdt from '../../images/usdt.png';
import './Liquidity.scss';

const Liquidity = (): JSX.Element => {
  const [lbctPercent, setLbtcPercent] = useState<FROM_AMOUNT_PERCENT>();
  const [usdtPercent, setUsdtPercent] = useState<FROM_AMOUNT_PERCENT>();
  const [inputFromAmount, setInputFromAmount] = useState<string>('0');
  const [inputToAmount, setInputToAmount] = useState<string>('0');

  const history = useHistory();

  return (
    <div className="liquidity-page-main">
      <Content className="liquidity-page-content">
        <Button
          className="liquidity-page-back-button"
          onClick={() => history.goBack()}
        >
          <Icon className="liquidity-back-icon" icon="angle-left" size="4x" />
          <div className="liquidity-back-text">L-BTC/USDT</div>
        </Button>
        <div className="liquidity-page-first-line">
          <div className="liquidity-first-line-item pt8">
            <SwapFromTab
              selectedFromAmountPercent={lbctPercent}
              setselectedFromAmountPercent={setLbtcPercent}
            />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="liquidity-input-content">
                <div className="liquidity-input-text">
                  <div className="liquidity-text">
                    {SWAP_ASSET.LBTC} Liquidity
                  </div>
                  <img className="liquidity-icon" src={btc} alt="" />
                </div>
                <input
                  className="liquidity-input"
                  inputMode="decimal"
                  autoComplete="off"
                  autoCorrect="off"
                  type="text"
                  pattern="^[0-9]*[.,]?[0-9]*$"
                  spellCheck="false"
                  value={inputFromAmount}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setInputFromAmount(event.target.value)
                  }
                />
              </div>
            </div>
          </div>
          <div className="liquidity-plus-icon">
            <img className="liquidity-page-icons" src={plus} alt="" />
          </div>
          <div className="liquidity-first-line-item pt8">
            <SwapFromTab
              selectedFromAmountPercent={usdtPercent}
              setselectedFromAmountPercent={setUsdtPercent}
            />
            <div className="liquidity-input-content">
              <div className="liquidity-input-text">
                <div className="liquidity-text">
                  {SWAP_ASSET.USDT} Liquidity
                </div>
                <img className="liquidity-icon" src={usdt} alt="" />
              </div>
              <input
                className="liquidity-input"
                inputMode="decimal"
                autoComplete="off"
                autoCorrect="off"
                type="text"
                pattern="^[0-9]*[.,]?[0-9]*$"
                spellCheck="false"
                value={inputToAmount}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setInputToAmount(event.target.value)
                }
              />
            </div>
          </div>
        </div>
        <div className="liquidity-page-second-line">
          <div className="liquidity-page-second-line-item-first">
            <div>
              <span className="liquidity-page-second-line-item-texts">
                LP you will get
              </span>
              <img className="liquidity-page-icons" src={lp} alt="" />
            </div>
            <div className="liquidity-page-second-line-item-values">250.00</div>
          </div>
          <div className="liquidity-page-second-line-item-second">
            <div>
              <span className="liquidity-page-second-line-item-texts">
                LP rewards
              </span>
              <img className="liquidity-page-icons" src={rew} alt="" />
            </div>
            <div className="liquidity-page-second-line-item-values">% 0.20</div>
          </div>
          <div className="liquidity-page-second-line-item-third">
            <div>
              <span className="liquidity-page-second-line-item-texts">
                Pool Share
              </span>
              <img className="liquidity-page-icons" src={pct} alt="" />
            </div>
            <div className="liquidity-page-second-line-item-values">% 12</div>
          </div>
        </div>

        <Button appearance="default" className="liquidity-button">
          Add Liquidity
        </Button>
      </Content>
    </div>
  );
};

export default Liquidity;
