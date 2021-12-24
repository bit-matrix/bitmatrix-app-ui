import React, { useState } from 'react';
import FROM_AMOUNT_PERCENT from '../../../enum/FROM_AMOUNT_PERCENT';
import { SwapFromTab } from '../../../components/SwapFromTab/SwapFromTab';
import LiquidityFooter from '../LiquidityFooter/LiquidityFooter';
import SWAP_ASSET from '../../../enum/SWAP_ASSET';
import plus from '../../../images/plus.png';
import btc from '../../../images/liquid_btc.png';
import usdt from '../../../images/usdt.png';
import './AddLiquidity.scss';

const AddLiquidity = (): JSX.Element => {
  const [lbctPercent, setLbtcPercent] = useState<FROM_AMOUNT_PERCENT>();
  const [usdtPercent, setUsdtPercent] = useState<FROM_AMOUNT_PERCENT>();
  const [inputFromAmount, setInputFromAmount] = useState<string>('0');
  const [inputToAmount, setInputToAmount] = useState<string>('0');

  return (
    <>
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
                <img className="liquidity-btc-icon" src={btc} alt="" />
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
              <div className="liquidity-text">{SWAP_ASSET.USDT} Liquidity</div>
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
      <LiquidityFooter />
    </>
  );
};

export default AddLiquidity;