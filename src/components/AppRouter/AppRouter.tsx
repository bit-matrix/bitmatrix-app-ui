import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ROUTE_PATH } from '../../enum/ROUTE_PATH';
import { Swap } from '../../pages/Swap/Swap';
import { Footer } from './Footer/Footer';
import { Navbar } from '../Navbar/Navbar';
import { Home } from '../../pages/Home/Home';
import { Pool } from '../../pages/Pool/Pool';
import { Content } from 'rsuite';
import { Settings } from '../../pages/Settings/Settings';
import Liquidity from '../../pages/Liquidity/Liquidity';
import './AppRouter.scss';
import { api } from '@bitmatrix/lib';
import { Pool as ModelPool } from '@bitmatrix/models';
import SettingsContext from '../../context/SettingsContext';
import SETTINGS_ACTION_TYPES from '../../context/SETTINGS_ACTION_TYPES';

export const AppRouter = (): JSX.Element => {
  const { dispatch, payloadData } = useContext(SettingsContext);

  // fetch pools with timer
  useEffect(() => {
    fetchPools();

    setInterval(() => {
      fetchPools();
    }, 10000);
  }, []);

  const fetchPools = () => {
    api.getPools().then((pools: ModelPool[]) => {
      dispatch({
        type: SETTINGS_ACTION_TYPES.SET_POOLS,
        payload: {
          ...payloadData,
          pools,
        },
      });
    });
  };

  return (
    <Router>
      <Content className="app-router-main">
        <div className="secret-top-div" />
        <Navbar />
        <div className="app-container">
          <Switch>
            <Route exact path={ROUTE_PATH.HOME} component={Home} />
            <Route exact path={ROUTE_PATH.SWAP} component={Swap} />
            <Route exact path={ROUTE_PATH.POOL} component={Pool} />
            {/*<Route exact path={ROUTE_PATH.STATS} component={Stats} />*/}
            <Route exact path={ROUTE_PATH.SETTINGS} component={Settings} />
            <Route exact path={ROUTE_PATH.LIQUIDITY} component={Liquidity} />
          </Switch>
        </div>

        <Footer />
        <div className="secret-footer-div" />
      </Content>
    </Router>
  );
};
