import React from 'react';
import { Button } from 'rsuite';
import { useHistory } from 'react-router-dom';
import { ROUTE_PATH } from '../../enum/ROUTE_PATH';
import { Info } from '../../components/common/Info/Info';
import HomeIcon from '../../images/homeweb.png';
import mobileHomeIcon from '../../images/mobilehome.png';
import './Home.scss';

export const Home = (): JSX.Element => {
  const history = useHistory();

  return (
    <div className="home-page-container">
      <div className="home-page-main">
        <div className="home-page-desc">
          <h3 className="home-page-desc-header">Automated Liquidity Provision on Liquid is Here!</h3>
          <div className="home-page-img-content desktop-hidden">
            <img className="home-page-img" src={mobileHomeIcon} alt="Home" />
          </div>
          <div className="home-page-desc-content">
            <p>
              Bitmatrix is a covenant-based AMM protocol where you can create your own pool, add liquidity to an
              existing pool, or swap two assets. The AMM pools are made of covenants that interoperate and enforce
              constraints, resulting in a fully-functional AMM based on the UTXO model.
            </p>
            <p>
              Whether swapping two assets or adding or removing liquidity, you can asynchronously transact regardless of
              the type of interaction.
            </p>
          </div>
          <Button
            className="home-page-start-button mobile-hidden"
            appearance="default"
            onClick={() => {
              history.push(ROUTE_PATH.SWAP);
            }}
          >
            Start Swapping
          </Button>
          <Button
            className="home-page-start-button desktop-hidden"
            appearance="default"
            href="https://link.medium.com/q5kUJd5E6jb"
            target="_blank"
          >
            Learn More
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
