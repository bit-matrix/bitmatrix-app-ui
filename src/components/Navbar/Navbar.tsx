import React, { useEffect, useState } from 'react';
import { Button, ButtonToolbar, Popover, Whisper } from 'rsuite';
import { useHistory } from 'react-router';
import { ROUTE_PATH } from '../../enum/ROUTE_PATH';
import { InfoCard } from '../InfoCard/InfoCard';
import { Loading } from '../Loading/Loading';
import bitmatrix_icon from '../../images/bitmatrix_icon.png';
import bmx_gray from '../../images/bmx_gray.png';
import swap from '../../images/swap.png';
import info from '../../images/info.png';
import stats from '../../images/stats.png';
import settings from '../../images/settings.png';
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
          {selectedTab === ROUTE_PATH.HOME ? (
            <img className="navbar-home-icon" src={bitmatrix_icon} alt="" />
          ) : (
            <img className="navbar-home-icon" src={bmx_gray} alt="" />
          )}
        </Button>
      </li>
      <li className="navbar-item mobile-hidden">
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
      <li className="navbar-item desktop-hidden">
        <Button
          className={`navbar-item-button ${
            selectedTab === ROUTE_PATH.SWAP && 'active'
          }`}
          onClick={() => {
            history.push(ROUTE_PATH.SWAP);
          }}
        >
          <img className="navbar-mobile-icon" src={swap} alt="" />
        </Button>
      </li>
      <li className="navbar-item mobile-hidden">
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
      <li className="navbar-item desktop-hidden">
        <Button
          className={`navbar-item-button ${
            selectedTab === ROUTE_PATH.POOL && 'active'
          }`}
          onClick={() => {
            history.push(ROUTE_PATH.POOL);
          }}
        >
          <img className="navbar-mobile-icon" src={info} alt="" />
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
      <li className="navbar-item desktop-hidden">
        <Button
          className={`navbar-item-button ${
            selectedTab === ROUTE_PATH.STATS && 'active'
          }`}
          // onClick={() => {
          //   history.push(ROUTE_PATH.STATS);
          // }}
        >
          <img className="navbar-mobile-icon" src={stats} alt="" />
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
      <li className="navbar-item desktop-hidden">
        <Button
          className={`navbar-item-button ${
            selectedTab === ROUTE_PATH.SETTINGS && 'active'
          }`}
          // onClick={() => {
          //   history.push(ROUTE_PATH.SETTINGS);
          // }}
        >
          <img className="navbar-mobile-icon" src={settings} alt="" />
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
