import React from 'react';
import { Button } from 'rsuite';
import { useHistory } from 'react-router-dom';
import { ROUTE_PATH } from '../../enum/ROUTE_PATH';
import { Info } from '../../components/common/Info/Info';
import HomeIcon from '../../images/homeweb.png';
import homeWebBase64 from '../../images/homeWebBase64';
import homeMobileBase64 from '../../images/homeMobileBase64';
import mobileHomeIcon from '../../images/mobilehome.png';
import ImgLazy from '../../components/ImgLazy/ImgLazy';
import './Home.scss';
import { ROUTE_PATH_TITLE } from '../../enum/ROUTE_PATH.TITLE';

export const Home = (): JSX.Element => {
  const history = useHistory();

  document.title = ROUTE_PATH_TITLE.HOME;

  return (
    <div className="home-page-container">
      <div className="home-page-main">
        <div className="home-page-desc">
          <h3 className="home-page-desc-header">Automated Liquidity Provision on Liquid is Here!</h3>
          <div className="home-page-img-content desktop-hidden">
            <ImgLazy src={mobileHomeIcon} alt="" x={288} y={221} minifyImg={homeMobileBase64} />
          </div>
          <div className="home-page-desc-content">
            <p>
              Bitmatrix is a trustless exchange protocol on Liquid Network that allows direct asset swaps without giving
              up the custody of funds. The protocol consists of a collection of covenant-based liquidity pools where
              each immutably lives on the network and enforces the trustless execution of trades.
            </p>
            <p>
              Liquidity pools have custody of pooled assets, sets prices according to a mathematical formula, and are
              always willing to trade those assets at those prices.
            </p>
          </div>
          <Button
            className="home-page-start-button mobile-hidden"
            appearance="default"
            onClick={() => {
              history.push({
                pathname: ROUTE_PATH.SWAP,
                state: {
                  from: history.location.pathname,
                },
              });
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
          <picture>
            <ImgLazy src={HomeIcon} alt="" x={590} y={768} minifyImg={homeWebBase64} />
          </picture>
        </div>
      </div>
      <Info content="Always make sure your URL is 'bitmatrix.app'" />
    </div>
  );
};
