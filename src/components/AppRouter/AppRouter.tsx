import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ROUTE_PATH } from '../../enum/ROUTE_PATH';
import { Swap } from '../../pages/Swap/Swap';
import { Footer } from './Footer/Footer';
import { Navbar } from '../Navbar/Navbar';
import { Home } from '../../pages/Home/Home';
import { Pool } from '../../pages/Pool/Pool';
import { Content } from 'rsuite';
import { Settings } from '../../pages/Settings/Settings';
import './AppRouter.scss';

export const AppRouter = (): JSX.Element => {
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
          </Switch>
        </div>

        <Footer />
        <div className="secret-footer-div" />
      </Content>
    </Router>
  );
};
