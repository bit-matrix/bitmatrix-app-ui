import React from 'react';
import { Button } from 'rsuite';
import { useHistory } from 'react-router-dom';
import { ROUTE_PATH } from '../../enum/ROUTE_PATH';
import { Info } from '../../components/common/Info/Info';
import HomeIcon from '../../images/homeweb.png';
import './Home.scss';

export const Home = (): JSX.Element => {
  const history = useHistory();
  return (
    <div className="home-page-container">
      <div className="home-page-main">
        <div className="home-page-desc">
          <h3 className="home-page-desc-header">
            Anonymous liquidity provision here!
          </h3>
          <div className="home-page-img-content desktop-hidden">
            <img className="home-page-img" src={HomeIcon} alt="Home" />
          </div>
          <div className="home-page-desc-content">
            <p>
              Bitmatrix is a constant product market maker built on Liquid
              Network.
            </p>
            <p>
              Bitmatrix utilizes the power of bitcoin opcodes to enable
              automated liquidity provision across L-BTC and other Liquid-based
              assets.
            </p>
            <p>
              Bitmatrix comes with maximally Uniswap-like UX and is effectively
              powered by Liquid's powerfull scripting capatilies.
            </p>
          </div>
          <Button
            className="home-page-start-button"
            appearance="default"
            onClick={() => {
              history.push(ROUTE_PATH.SWAP);
            }}
          >
            Start Swapping
          </Button>
        </div>
        <div className="home-page-img-content mobile-hidden">
          <img className="home-page-img" src={HomeIcon} alt="Home" />
        </div>
      </div>
      <Info content="Always make sure your URL is 'bitmatrix.app'" />
    </div>
  );
};
