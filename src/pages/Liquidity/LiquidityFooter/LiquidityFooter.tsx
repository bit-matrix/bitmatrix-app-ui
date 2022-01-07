import React from 'react';
import lp from '../../../images/lp.png';
import pct from '../../../images/pct.png';
import rew from '../../../images/rew.png';
import './LiquidityFooter.scss';

type Props = {
  received?: string;
  rewards?: string;
  pool_share?: string;
};

const LiquidityFooter: React.FC<Props> = ({ received, rewards, pool_share }): JSX.Element => {
  return (
    <div className="liquidity-page-footer">
      <div className="liquidity-page-footer-line-item-first">
        <div>
          <span className="liquidity-page-footer-line-item-texts">LP you will get</span>
          <img className="liquidity-page-icons" src={lp} alt="" />
        </div>
        <div className="liquidity-page-footer-line-item-values">{received}</div>
      </div>
      <div className="liquidity-page-footer-line-item-second mobile-hidden">
        <div>
          <span className="liquidity-page-footer-line-item-texts">LP rewards</span>
          <img className="liquidity-page-icons" src={rew} alt="" />
        </div>
        <div className="liquidity-page-footer-line-item-values">% {rewards}</div>
      </div>
      <div className="liquidity-page-footer-line-item-third">
        <div>
          <span className="liquidity-page-footer-line-item-texts">Pool Share</span>
          <img className="liquidity-page-icons" src={pct} alt="" />
        </div>
        <div className="liquidity-page-footer-line-item-values">% {pool_share}</div>
      </div>
    </div>
  );
};

export default LiquidityFooter;
