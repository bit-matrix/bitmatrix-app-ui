import React from "react";
import "./Navbar.scss";
import { Button } from "rsuite";

export const Navbar = () => {
  return (
    <ul className="navbar-main">
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
        <Button className="navbar-item-button">Wallet</Button>
      </li>
      <li className="navbar-item mobile-hidden">
        <Button className="navbar-item-button">Settings</Button>
      </li>
    </ul>
  );
};
