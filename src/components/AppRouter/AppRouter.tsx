import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { api } from '@bitmatrix/lib';
import { Pool as ModelPool, BmConfig } from '@bitmatrix/models';
import SettingsContext from '../../context/SettingsContext';
import SETTINGS_ACTION_TYPES from '../../context/SETTINGS_ACTION_TYPES';
import { ROUTE_PATH } from '../../enum/ROUTE_PATH';
import { Swap } from '../../pages/Swap/Swap';
import { Footer } from './Footer/Footer';
import { Navbar } from '../Navbar/Navbar';
import { Home } from '../../pages/Home/Home';
import { Pool } from '../../pages/Pool/Pool';
import { Stats } from '../../pages/Stats/Stats';
import { Content, Loader } from 'rsuite';
import { Settings } from '../../pages/Settings/Settings';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { CommitmentStore } from '../../model/CommitmentStore';
import RemoveLiquidity from '../../pages/Liquidity/RemoveLiquidity/RemoveLiquidity';
import AddLiquidity from '../../pages/Liquidity/AddLiquidity/AddLiquidity';
import { PoolDetail } from '../../pages/PoolDetail/PoolDetail';
import { MyPoolDetail } from '../../pages/PoolDetail/MyPoolDetail';
import './AppRouter.scss';
import { detectProvider } from 'marina-provider';
import { Wallet } from '../../lib/wallet';
import { IWallet } from '../../lib/wallet/IWallet';

export const AppRouter = (): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true);
  const { dispatch, payloadData } = useContext(SettingsContext);
  const { getTxLocalData, setTxLocalData } = useLocalStorage<CommitmentStore[]>('BmTxV3');

  // fetch pools with timer
  useEffect(() => {
    fetchPools(true);

    setInterval(() => {
      fetchPools(false);
    }, 10000);
  }, []);

  useEffect(() => {
    detectProvider('marina')
      .then((marina) => {
        const marinaWallet = new Wallet();

        marina.isEnabled().then((enabled) => {
          fetchBalances(marinaWallet);

          dispatch({
            type: SETTINGS_ACTION_TYPES.SET_WALLET,
            payload: {
              ...payloadData,
              wallet: { marina: marinaWallet, isEnabled: enabled, balances: [] },
            },
          });
        });
      })
      .catch(() => {
        const marinaWallet = new Wallet();

        dispatch({
          type: SETTINGS_ACTION_TYPES.SET_WALLET,
          payload: {
            ...payloadData,
            wallet: { marina: marinaWallet, isEnabled: false, balances: [] },
          },
        });
      });
  }, []);

  useEffect(() => {
    setInterval(() => {
      if (payloadData.wallet) {
        fetchBalances(payloadData.wallet?.marina);
      }
    }, 60000);
  }, [payloadData.wallet?.marina]);

  const fetchBalances = async (wall: IWallet) => {
    if (payloadData.wallet?.isEnabled) {
      wall
        .getBalances()
        .then((balances) => {
          dispatch({
            type: SETTINGS_ACTION_TYPES.SET_WALLET,
            payload: {
              ...payloadData,
              wallet: { marina: wall, isEnabled: true, balances },
            },
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const fetchPools = (isInitialize: boolean) => {
    api
      .getPools()
      .then((pools: ModelPool[]) => {
        const filteredPool = pools.filter(
          (p) => p.id !== 'db7a0fa02b9649bb70d084f24412028a8b4157c91d07715a56870a161f041cb3',
        );

        if (isInitialize) {
          api.getBmConfigs(filteredPool[0].id).then((pool_config: BmConfig) => {
            dispatch({
              type: SETTINGS_ACTION_TYPES.SET_POOL_CONFIG,
              payload: {
                ...payloadData,
                pool_config,
              },
            });
          });
        }

        checkLastTxStatus(filteredPool[0].id);
        dispatch({
          type: SETTINGS_ACTION_TYPES.SET_POOLS,
          payload: {
            ...payloadData,
            pools: filteredPool,
          },
        });
      })
      .finally(() => {
        setLoading(false);
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
          {loading ? (
            <div id="loaderInverseWrapper" style={{ height: 200 }}>
              <Loader size="md" inverse center content={<span>Loading...</span>} vertical />
            </div>
          ) : (
            <Switch>
              <Route exact path={ROUTE_PATH.HOME} component={Home} />
              <Route exact path={ROUTE_PATH.SWAP} component={Swap} />
              <Route exact path={ROUTE_PATH.POOL} component={Pool} />
              <Route exact path={ROUTE_PATH.POOL_DETAIL} component={PoolDetail} />
              <Route exact path={ROUTE_PATH.MY_POOL} component={MyPoolDetail} />
              <Route exact path={ROUTE_PATH.STATS} component={Stats} />
              <Route exact path={ROUTE_PATH.SETTINGS} component={Settings} />
              <Route exact path={ROUTE_PATH.ADD_LIQUIDTY} component={AddLiquidity} />
              <Route exact path={ROUTE_PATH.REMOVE_LIQUIDITY} component={RemoveLiquidity} />
            </Switch>
          )}
        </div>
        <Footer />
        <div className="secret-footer-div" />
      </Content>
    </Router>
  );
};
