import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { api } from '@bitmatrix/lib';
import { Pool as ModelPool } from '@bitmatrix/models';
import SettingsContext from '../../context/SettingsContext';
import SETTINGS_ACTION_TYPES from '../../context/SETTINGS_ACTION_TYPES';
import { ROUTE_PATH } from '../../enum/ROUTE_PATH';
import { Swap } from '../../pages/Swap/Swap';
import { Footer } from './Footer/Footer';
import { Navbar } from '../Navbar/Navbar';
import { Home } from '../../pages/Home/Home';
import { Pool } from '../../pages/Pool/Pool';
import { Stats } from '../../pages/Stats/Stats';
import { Content } from 'rsuite';
import { Settings } from '../../pages/Settings/Settings';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { CommitmentStore } from '../../model/CommitmentStore';
import './AppRouter.scss';
import RemoveLiquidity from '../../pages/Liquidity/RemoveLiquidity/RemoveLiquidity';
import AddLiquidity from '../../pages/Liquidity/AddLiquidity/AddLiquidity';

export const AppRouter = (): JSX.Element => {
  const { dispatch, payloadData } = useContext(SettingsContext);
  const { getTxLocalData, setTxLocalData } = useLocalStorage<CommitmentStore[]>('BmTxV2');

  // fetch pools with timer
  useEffect(() => {
    fetchPools();

    setInterval(() => {
      fetchPools();
    }, 10000);
  }, []);

  const fetchPools = () => {
    api.getPools().then((pools: ModelPool[]) => {
      const filteredPool = pools.filter(
        (p) => p.id !== 'db7a0fa02b9649bb70d084f24412028a8b4157c91d07715a56870a161f041cb3',
      );

      checkLastTxStatus(filteredPool[0].id);
      dispatch({
        type: SETTINGS_ACTION_TYPES.SET_POOLS,
        payload: {
          ...payloadData,
          pools: filteredPool,
        },
      });
    });
  };

  const checkLastTxStatus = (poolId: string) => {
    const txHistory = getTxLocalData();

    if (txHistory && txHistory.length > 0) {
      const unconfirmedTxs = txHistory.filter((utx) => utx.completed === false);

      if (unconfirmedTxs.length > 0) {
        unconfirmedTxs.forEach((transaction) => {
          if (transaction.txId) {
            api.getCtxMempool(transaction.txId, poolId).then((ctxResponse) => {
              if (!ctxResponse) {
                api.getPtx(transaction.txId, poolId).then((ptxResponse) => {
                  if (ptxResponse) {
                    const newTxHistory = [...txHistory];
                    const willChangedTx = newTxHistory.findIndex((ntx) => {
                      return ntx.txId === transaction.txId;
                    });

                    newTxHistory[willChangedTx].completed = true;
                    newTxHistory[willChangedTx].success = true;

                    setTxLocalData(newTxHistory);
                  }
                });
              }
            });
          }
        });
      }
    }
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
            <Route exact path={ROUTE_PATH.STATS} component={Stats} />
            <Route exact path={ROUTE_PATH.SETTINGS} component={Settings} />
            <Route exact path={ROUTE_PATH.ADD_LIQUIDTY} component={AddLiquidity} />
            <Route exact path={ROUTE_PATH.REMOVE_LIQUIDITY} component={RemoveLiquidity} />
          </Switch>
        </div>
        <Footer />
        <div className="secret-footer-div" />
      </Content>
    </Router>
  );
};
