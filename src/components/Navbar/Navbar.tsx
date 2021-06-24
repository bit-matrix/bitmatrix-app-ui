import React from 'react';
import bitmatrix_icon from '../../images/bitmatrix_icon.png';
import { Button } from 'rsuite';
import './Navbar.scss';

export const Navbar = (): JSX.Element => {
  return (
    <ul className="navbar-main">
      <li className="navbar-item">
        <Button className="navbar-home-button ml-5">
          <img className="navbar-home-icon" src={bitmatrix_icon} alt="" />
        </Button>
      </li>
      <li className="navbar-item">
        <Button className="navbar-item-button">Swap</Button>
      </li>
      <li className="navbar-item">
        <Button className="navbar-item-button">Pool</Button>
      </li>
      <li className="navbar-item">
        <Button className="navbar-item-button">Stats</Button>
      </li>
      <li className="navbar-item mobile-hidden">
        <Button className="navbar-item-button mr-5">Settings</Button>
      </li>
    </ul>
  );
};
