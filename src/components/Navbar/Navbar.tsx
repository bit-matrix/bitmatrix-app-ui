import React, { useEffect, useState } from 'react';
import { Button, ButtonToolbar, Popover, Whisper } from 'rsuite';
import { CommitmentStore } from '../../model/CommitmentStore';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useHistory } from 'react-router';
import { ROUTE_PATH } from '../../enum/ROUTE_PATH';
import { InfoCard } from '../InfoCard/InfoCard';
import { Loading } from '../Loading/Loading';
import Svg from '../base/Svg/Svg';
import success from '../../images/tick.png';
import failed from '../../images/txrevert.png';
import './Navbar.scss';

export const Navbar: React.FC = (): JSX.Element => {
  const [selectedTab, setSelectedTab] = useState<ROUTE_PATH>(ROUTE_PATH.HOME);
  const history = useHistory();

  const { getTxLocalData, setTxLocalData } = useLocalStorage<CommitmentStore[]>('BmTxV1');
  const txHistory = getTxLocalData();
  const unconfirmedTxs = txHistory?.filter((utx) => utx.completed === false);

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

  const txInfo = (): JSX.Element | undefined => {
    if (unconfirmedTxs && unconfirmedTxs.length > 0) {
      return (
        <div>
          <Loading width="1.5rem" height="1.5rem" />
        </div>
      );
    } else {
      if (txHistory && txHistory.length > 0) {
        if (txHistory[txHistory.length - 1].success) {
          return <img className="navbar-item-icon" src={success} alt="" />;
        } else {
          <img className="navbar-item-icon" src={failed} alt="" />;
        }
      }
    }
  };

  const infoTab = (): JSX.Element | undefined => {
    if (txHistory && txHistory.length > 0) {
      if (txHistory[txHistory.length - 1].seen === false) {
        return (
          <li className="navbar-item mobile-hidden">
            <div
              tabIndex={0}
              className="navbar-item-circle-div"
              onBlur={() => {
                if (txHistory && txHistory.length > 0) {
                  if (txHistory[txHistory.length - 1].completed) {
                    const newTxHistory = [...txHistory];
                    newTxHistory[newTxHistory.length - 1].seen = true;
                    setTxLocalData(newTxHistory);
                  }
                }
              }}
            >
              <ButtonToolbar>
                <Whisper
                  placement="bottom"
                  trigger="click"
                  speaker={<Popover className="navbar-popover">{<InfoCard />}</Popover>}
                  enterable
                >
                  {txInfo()}
                </Whisper>
              </ButtonToolbar>
            </div>
          </li>
        );
      }
    }
  };

  return (
    <ul className="navbar-main">
      <li className="navbar-item">
        <Button
          className={`navbar-home-button  ${selectedTab === ROUTE_PATH.HOME && 'active'}`}
          onClick={() => {
            history.push(ROUTE_PATH.HOME);
          }}
        >
          <Svg
            className={`home-icon ${selectedTab === ROUTE_PATH.HOME ? 'selected-home-icon' : 'unselected-home-icon'} `}
            path="M 78.1 73.55 L 219.4 121.9 360.7 73.55 219.4 25.55 78.1 73.55 M 144.2 159.95 L 63.35 132.55 63.35 292.3 213 342.7 213 135.75 144.2 159.95 M 137.15 181 Q 139.05 180.05 141.35 180.8 143.45 181.4 144.4 183.5 L 152.65 200.15 Q 153.4 201.5 154.55 201.5 L 172.9 204.2 Q 174.85 204.6 176 205.75 177.5 207.45 177.5 209.75 177.5 212.05 175.8 213.6 L 162.6 226.4 Q 161.8 227.2 161.8 228.7 L 165.1 246.95 Q 165.45 249.6 163.95 251.35 162.4 253.05 159.7 253.45 L 157.25 252.7 140.8 244.05 Q 139.45 243.5 138.5 244.05 L 122.05 252.7 Q 118.2 254.6 115.35 251.35 113.6 249.6 114.2 246.95 L 117.25 228.7 Q 117.45 227.4 116.5 226.4 L 103.3 213.6 Q 101.95 212.05 101.75 210.35 101.35 208.2 102.7 206.3 104.05 204.6 106.35 204.2 L 124.7 201.5 Q 125.85 201.5 126.45 200.15 L 134.65 183.5 Q 135.6 181.95 137.15 181 M 0 99.3 L 143.9 148.1 201.75 128.3 58.05 79.55 0 99.3 M 12.65 48.1 L 64.15 65.75 205.15 17.55 153.4 0 12.65 48.1 M 375.45 292.3 L 375.45 132.55 294.6 159.95 225.75 135.75 225.75 342.7 375.45 292.3 M 325.3 180.65 L 338.15 182.55 Q 339.5 182.8 340.3 183.6 341.35 184.8 341.35 186.4 341.35 188 340.15 189.1 L 330.95 198.05 Q 330.4 198.6 330.4 199.65 L 332.7 212.4 Q 332.95 214.25 331.9 215.5 330.8 216.7 328.9 216.95 L 327.2 216.45 315.7 210.4 Q 314.75 210 314.1 210.4 L 302.6 216.45 Q 299.9 217.75 297.9 215.5 296.65 214.25 297.1 212.4 L 299.25 199.65 Q 299.35 198.75 298.7 198.05 L 289.45 189.1 Q 288.55 188 288.4 186.85 288.1 185.35 289.05 184 290 182.8 291.6 182.55 L 304.45 180.65 Q 305.25 180.65 305.65 179.7 L 311.4 168.05 Q 312.05 167 313.15 166.3 314.45 165.65 316.1 166.2 317.55 166.6 318.2 168.05 L 324 179.7 Q 324.5 180.65 325.3 180.65 M 284.3 242.65 L 297.15 244.55 Q 298.5 244.8 299.3 245.6 300.35 246.8 300.35 248.4 300.35 250 299.15 251.1 L 289.95 260.05 Q 289.4 260.6 289.4 261.65 L 291.7 274.4 Q 291.95 276.25 290.9 277.5 289.8 278.7 287.9 278.95 L 286.2 278.45 274.7 272.4 Q 273.75 272 273.1 272.4 L 261.6 278.45 Q 258.9 279.75 256.9 277.5 255.65 276.25 256.1 274.4 L 258.25 261.65 Q 258.35 260.75 257.7 260.05 L 248.45 251.1 Q 247.55 250 247.4 248.85 247.1 247.35 248.05 246 249 244.8 250.6 244.55 L 263.45 242.65 Q 264.25 242.65 264.65 241.7 L 270.4 230.05 Q 271.05 229 272.15 228.3 273.45 227.65 275.1 228.2 276.55 228.6 277.2 230.05 L 283 241.7 Q 283.5 242.65 284.3 242.65 M 438.8 99.3 L 380.75 79.55 237.05 128.3 294.9 148.1 438.8 99.3 M 374.65 65.75 L 426.15 48.1 285.4 0 233.65 17.55 374.65 65.75 Z"
            viewBox="0 0 441 345"
          ></Svg>
        </Button>
      </li>
      <li className="navbar-item ">
        <Button
          className={`navbar-item-button ${selectedTab === ROUTE_PATH.SWAP && 'active'}`}
          onClick={() => {
            history.push(ROUTE_PATH.SWAP);
          }}
        >
          Swap
        </Button>
      </li>

      <li className="navbar-item ">
        <Button
          className={`navbar-item-button ${selectedTab === ROUTE_PATH.POOL && 'active'}`}
          onClick={() => {
            history.push(ROUTE_PATH.POOL);
          }}
        >
          Pool
        </Button>
      </li>

      <li className="navbar-item mobile-hidden ">
        <Button
          className={`navbar-item-button ${selectedTab === ROUTE_PATH.STATS && 'active'}`}
          // onClick={() => {
          //   history.push(ROUTE_PATH.STATS);
          // }}
        >
          Stats
        </Button>
      </li>

      <li className="navbar-item ">
        <Button
          className={`navbar-item-button mr-5 ${selectedTab === ROUTE_PATH.SETTINGS && 'active'}`}
          onClick={() => {
            history.push(ROUTE_PATH.SETTINGS);
          }}
        >
          Settings
        </Button>
      </li>

      {infoTab()}
    </ul>
  );
};
