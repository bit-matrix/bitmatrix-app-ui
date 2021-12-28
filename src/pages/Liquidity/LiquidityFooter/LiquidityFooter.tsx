import React from 'react';
import lp from '../../../images/lp.png';
import pct from '../../../images/pct.png';
import rew from '../../../images/rew.png';
import './LiquidityFooter.scss';

const LiquidityFooter = (): JSX.Element => {
  return (
    <div className="liquidity-page-footer">
      <div className="liquidity-page-footer-line-item-first">
        <div>
          <span className="liquidity-page-footer-line-item-texts">LP you will get</span>
          <img className="liquidity-page-icons" src={lp} alt="" />
        </div>
        <div className="liquidity-page-footer-line-item-values">250.00</div>
      </div>
      <div className="liquidity-page-footer-line-item-second">
        <div>
          <span className="liquidity-page-footer-line-item-texts">LP rewards</span>
          <img className="liquidity-page-icons" src={rew} alt="" />
        </div>
        <div className="liquidity-page-footer-line-item-values">% 0.20</div>
      </div>
      <div className="liquidity-page-footer-line-item-third">
        <div>
          <span className="liquidity-page-footer-line-item-texts">Pool Share</span>
          <img className="liquidity-page-icons" src={pct} alt="" />
        </div>
        <div className="liquidity-page-footer-line-item-values">% 12</div>
      </div>
    </div>
  );
};

export default LiquidityFooter;
