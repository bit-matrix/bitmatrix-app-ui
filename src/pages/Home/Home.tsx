import React from 'react';
import { Button } from 'rsuite';
import './Home.scss';

export const Home = (): JSX.Element => {
  return (
    <div className="home-page-main">
      <div className="home-page-desc">
        <h3 className="home-page-desc-header">
          Anonymous liquidity provision here!
        </h3>
        <div className="home-page-desc-content">
          <p>
            Bitmatrix is a constant product market maker built on Liquid
            Network.
          </p>
          <p>
            Bitmatrix utilizes the power of bitcoin opcodes to enable automated
            liquidity provision across L-BTC and other Liquid-based assets.
          </p>
          <p>
            Bitmatrix comes with maximally Uniswap-like UX and is effectively
            powered by Liquid's powerfull scripting capatilies.
          </p>
        </div>
        <Button className="home-page-start-button" appearance="default">
          Start Swapping
        </Button>
      </div>
      <div className="home-page-img"></div>
    </div>
  );
};
