import React from 'react';
import { Button, Slider } from 'rsuite';
import LiquidityFooter from '../LiquidityFooter/LiquidityFooter';
import './RemoveLiquidity.scss';

const RemoveLiquidity = (): JSX.Element => {
  return (
    <>
      <div className="remove-liquidity-main">
        <div className="remove-liquidity-text">
          <div className="remove-liquidity-text-header">Removal Percentage</div>
          <div className="remove-liquidity-text-body">% 95.45</div>
        </div>
        <div className="remove-liquidity-slider">
          <Slider />
        </div>
        <div className="remove-liquidity-button-toolbar">
          <Button className="remove-liquidity-buttons mobile-hidden" appearance="ghost">
            % 10
          </Button>
          <Button className="remove-liquidity-buttons" appearance="ghost">
            % 25
          </Button>
          <Button className="remove-liquidity-buttons" appearance="ghost">
            % 50
          </Button>
          <Button className="remove-liquidity-buttons" appearance="ghost">
            % 75
          </Button>
          <Button className="remove-liquidity-buttons" appearance="ghost">
            % 100
          </Button>
        </div>
      </div>
      <LiquidityFooter />
    </>
  );
};

export default RemoveLiquidity;
