import React, { useEffect, useState } from 'react';
import bitmatrix_icon from '../../images/bitmatrix_icon.png';
import { Button, ButtonToolbar, Popover, Progress, Whisper } from 'rsuite';
import { useHistory } from 'react-router';
import { ROUTE_PATH } from '../../enum/ROUTE_PATH';
import { InfoCard } from '../InfoCard/InfoCard';
import { Loading } from '../Loading/Loading';
import './Navbar.scss';

export const Navbar = (): JSX.Element => {
  const [selectedTab, setSelectedTab] = useState<ROUTE_PATH>(ROUTE_PATH.HOME);
  const history = useHistory();

  useEffect(() => {
    let unmounted = false;
    let unregisterCallback: () => void;
    if (!unmounted) {
      //init tab selection
      setSelectedTab(history.location.pathname as ROUTE_PATH);
      unregisterCallback = history.listen((location) => {
        setSelectedTab(location.pathname as ROUTE_PATH);
      });
    }
    return () => {
      unmounted = true;
      if (unregisterCallback) unregisterCallback();
    };
  }, [history]);

  return (
    <ul className="navbar-main">
      <li className="navbar-item">
        <Button
          className={`navbar-home-button  ${
            selectedTab === ROUTE_PATH.HOME && 'active'
          }`}
          onClick={() => {
            history.push(ROUTE_PATH.HOME);
          }}
        >
          <img className="navbar-home-icon" src={bitmatrix_icon} alt="" />
        </Button>
      </li>
      <li className="navbar-item">
        <Button
          className={`navbar-item-button ${
            selectedTab === ROUTE_PATH.SWAP && 'active'
          }`}
          onClick={() => {
            history.push(ROUTE_PATH.SWAP);
          }}
        >
          Swap
        </Button>
      </li>
      <li className="navbar-item">
        <Button
          className={`navbar-item-button ${
            selectedTab === ROUTE_PATH.POOL && 'active'
          }`}
          onClick={() => {
            history.push(ROUTE_PATH.POOL);
          }}
        >
          Pool
        </Button>
      </li>
      <li className="navbar-item mobile-hidden">
        <Button
          className={`navbar-item-button ${
            selectedTab === ROUTE_PATH.STATS && 'active'
          }`}
          // onClick={() => {
          //   history.push(ROUTE_PATH.STATS);
          // }}
        >
          Stats
        </Button>
      </li>
      <li className="navbar-item mobile-hidden">
        <Button
          className={`navbar-item-button mr-5 ${
            selectedTab === ROUTE_PATH.SETTINGS && 'active'
          }`}
          // onClick={() => {
          //   history.push(ROUTE_PATH.SETTINGS);
          // }}
        >
          Settings
        </Button>
      </li>
      <li className="navbar-item mobile-hidden">
        <div className="navbar-item-circle-div">
          <ButtonToolbar>
            <Whisper
              placement="bottom"
              trigger="hover"
              speaker={
                <Popover className="navbar-popover">
                  <InfoCard />
                </Popover>
              }
              enterable
            >
              <Button className="navbar-hover-button">
                <Loading width="2rem" height="2rem" />
                {/* <div className="loader" /> */}
                <span className="navbar-item-info">1</span>
              </Button>
            </Whisper>
          </ButtonToolbar>
        </div>
      </li>
    </ul>
  );
};
