import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ROUTE_PATH } from '../../enum/ROUTE_PATH';
import { Swap } from '../../pages/Swap/Swap';
import { Footer } from './Footer/Footer';

export const AppRouter = (): JSX.Element => {
  return (
    <Router>
      <Switch>
        <Route exact path={ROUTE_PATH.HOME} component={Swap} />
        <Route exact path={ROUTE_PATH.SWAP} component={Swap} />
        {/* <Route exact path={ROUTE_PATH.POOL} component={Pool} />
        <Route exact path={ROUTE_PATH.STATS} component={Stats} />
        <Route exact path={ROUTE_PATH.SETTINGS} component={Setting} /> */}
      </Switch>
      <Footer />
    </Router>
  );
};
