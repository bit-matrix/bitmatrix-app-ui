import React from 'react';
import './Navbar.scss';
import { Button } from 'rsuite';

const Navbar = () => {
  return (
    <ul className="navbar-main">
      <li className="navbar-item">
        <Button className="navbar-item-button">Swap</Button>
      </li>
      <li className="navbar-item">
        <Button className="navbar-item-button">Pool</Button>
      </li>
      <li className="navbar-item">
        <Button className="navbar-item-button">Hedge</Button>
      </li>
      <li className="navbar-item">
        <Button className="navbar-item-button">Redeem</Button>
      </li>
      <li className="navbar-item">
        <Button className="navbar-item-button">Vote</Button>
      </li>
    </ul>
  );
};

export default Navbar;
