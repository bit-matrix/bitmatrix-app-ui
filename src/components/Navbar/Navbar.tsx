import React from 'react';
import bitmatrix_icon from '../../images/bitmatrix_icon.png';
import { Button } from 'rsuite';
import { useHistory } from 'react-router';
import { ROUTE_PATH } from '../../enum/ROUTE_PATH';
import './Navbar.scss';

export const Navbar = (): JSX.Element => {
  const history = useHistory();

  return (
    <ul className="navbar-main">
      <li className="navbar-item">
        <Button
          className="navbar-home-button ml-5"
          onClick={() => {
            history.push(ROUTE_PATH.HOME);
          }}
        >
          <img className="navbar-home-icon" src={bitmatrix_icon} alt="" />
        </Button>
      </li>
      <li className="navbar-item">
        <Button
          className="navbar-item-button"
          onClick={() => {
            history.push(ROUTE_PATH.SWAP);
          }}
        >
          Swap
        </Button>
      </li>
      <li className="navbar-item">
        <Button
          className="navbar-item-button"
          // onClick={() => {
          //   history.push(ROUTE_PATH.POOL);
          // }}
        >
          Pool
        </Button>
      </li>
      <li className="navbar-item">
        <Button
          className="navbar-item-button"
          // onClick={() => {
          //   history.push(ROUTE_PATH.STATS);
          // }}
        >
          Stats
        </Button>
      </li>
      <li className="navbar-item mobile-hidden">
        <Button
          className="navbar-item-button mr-5"
          // onClick={() => {
          //   history.push(ROUTE_PATH.SETTINGS);
          // }}
        >
          Settings
        </Button>
      </li>
    </ul>
  );
};
