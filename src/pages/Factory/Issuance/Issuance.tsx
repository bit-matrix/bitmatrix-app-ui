import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'rsuite';
import { ROUTE_PATH } from '../../../enum/ROUTE_PATH';
import issuance1 from '../../../images/issuance1.png';
import issuance2 from '../../../images/issuance2.png';
import issuance3 from '../../../images/issuance3.png';
import './Issuance.scss';

export const Issuance = (): JSX.Element => {
  const history = useHistory();

  return (
    <div className="issuance-page-main">
      <div className="issuance-content-item">
        <h4 className="home-page-desc-header">
          Issue a <br /> Fungible Token
        </h4>
        <p>Issue and manage fungible tokens on the Liquid Network with Bitmatrix</p>
        <div className="issuance-img-content">
          <img className="issuance-img" src={issuance1} alt="Home" />
        </div>
        <div className="issuance-button-content">
          <Button
            className="issuance-button"
            appearance="default"
            onClick={() => {
              history.push(ROUTE_PATH.ISSUE_TOKEN);
            }}
          >
            Issue Now
          </Button>
        </div>
      </div>
      <div className="issuance-content-item">
        <h4 className="home-page-desc-header">
          Issue a <br /> Non-fungible Token
        </h4>
        <p>Issue and manage non-fungible tokens on the Liquid Network with Bitmatrix</p>
        <div className="issuance-img-content">
          <img className="issuance-img" src={issuance2} alt="Home" />
        </div>
        <div className="issuance-button-content">
          <Button
            className="issuance-button"
            appearance="default"
            onClick={() => {
              history.push(ROUTE_PATH.ISSUE_TOKEN);
            }}
          >
            Issue Now
          </Button>
        </div>
      </div>
      <div className="issuance-content-item">
        <h4 className="home-page-desc-header">
          Issue a <br /> Security Token
        </h4>
        <p>Issue and manage security assets on the Liquid Network with BlockStream AMP's flexible API.</p>
        <div className="issuance-img-content">
          <img className="issuance-img" src={issuance3} alt="Home" />
        </div>
        <div className="issuance-button-content">
          <Button
            className="issuance-button"
            appearance="default"
            onClick={() => {
              history.push(ROUTE_PATH.ISSUE_TOKEN);
            }}
          >
            Go to BlockStream AMP
          </Button>
        </div>
      </div>
    </div>
  );
};
