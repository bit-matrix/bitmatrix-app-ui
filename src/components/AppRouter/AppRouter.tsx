import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { api } from '@bitmatrix/lib';
import { Pool as ModelPool, BmConfig, BmChart } from '@bitmatrix/models';
import SettingsContext from '../../context/SettingsContext';
import SETTINGS_ACTION_TYPES from '../../context/SETTINGS_ACTION_TYPES';
import { ROUTE_PATH } from '../../enum/ROUTE_PATH';
import { Swap } from '../../pages/Swap/Swap';
import { Footer } from './Footer/Footer';
import { Navbar } from '../Navbar/Navbar';
import { Home } from '../../pages/Home/Home';
import { Pool } from '../../pages/Pool/Pool';
// import { Factory } from '../../pages/Factory/Factory';
// import { IssueToken } from '../../pages/Factory/Issuance/IssueToken/IssueToken';
import { Content, Loader } from 'rsuite';
import { Settings } from '../../pages/Settings/Settings';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { CommitmentStore } from '../../model/CommitmentStore';
import RemoveLiquidity from '../../pages/Liquidity/RemoveLiquidity/RemoveLiquidity';
import AddLiquidity from '../../pages/Liquidity/AddLiquidity/AddLiquidity';
import { PoolDetail } from '../../pages/PoolDetail/PoolDetail';
import { MyPoolDetail } from '../../pages/PoolDetail/MyPoolDetail/MyPoolDetail';
import { detectProvider } from 'marina-provider';
import { Wallet } from '../../lib/wallet';
import { IWallet } from '../../lib/wallet/IWallet';
import Switch from 'react-router-transition-switch';
import Fader from 'react-fader';
import { NotFound } from '../../pages/NotFound/NotFound';
import './AppRouter.scss';

export const AppRouter = (): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true);
  const { dispatch, payloadData } = useContext(SettingsContext);
  const { getLocalData, setLocalData } = useLocalStorage<CommitmentStore[]>('BmTxV3');

  // fetch pools with timer
  useEffect(() => {
    fetchData(true);
    // fetchPools(true);
    setInterval(() => {
      fetchData(false);
      // fetchPools(false);
    }, 10000);
  }, []);

  useEffect(() => {
    detectProvider('marina')
      .then((marina) => {
        const marinaWallet = new Wallet();

        marina.isEnabled().then((enabled) => {
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
    if (payloadData.wallet?.marina) {
      fetchBalances(payloadData.wallet.marina);
    }

    setInterval(() => {
      if (payloadData.wallet) {
        fetchBalances(payloadData.wallet?.marina);
      }
    }, 10000);
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

  const fetchData = async (isInitialize: boolean) => {
    const pools: ModelPool[] = await api.getPools();

    const filteredPool = pools.filter(
      (p) => p.id === '0bc48e957a11bb1fd50c6297c98225b8687b61f1af87a8ac625f5e5e5c6e3585',
    );

    const poolId: string = filteredPool[0].id;

    dispatch({
      type: SETTINGS_ACTION_TYPES.SET_POOLS,
      payload: {
        ...payloadData,
        pools: filteredPool,
      },
    });

    checkLastTxStatus(poolId);

    if (isInitialize) {
      const pool_config: BmConfig = await api.getBmConfigs(poolId);

      dispatch({
        type: SETTINGS_ACTION_TYPES.SET_POOL_CONFIG,
        payload: {
          ...payloadData,
          pool_config,
        },
      });
    }

    if (location.pathname.startsWith('/pool') || isInitialize) {
      const pool_chart_data: BmChart[] = await api.getPoolChartData(poolId);

      dispatch({
        type: SETTINGS_ACTION_TYPES.SET_POOL_CHART_DATA,
        payload: {
          ...payloadData,
          pool_chart_data,
        },
      });
    }
    setLoading(false);
  };

  const checkLastTxStatus = (poolId: string) => {
    const txHistory = getLocalData();

    if (txHistory && txHistory.length > 0) {
      const unconfirmedTxs = txHistory.filter((utx) => utx.completed === false);

      if (unconfirmedTxs.length > 0) {
        unconfirmedTxs.forEach((transaction) => {
          if (transaction.txId) {
            api.getCtxMempool(transaction.txId, poolId).then((ctxResponse) => {
              if (ctxResponse) {
                const newTxHistory = [...txHistory];
                const willChangedTx = newTxHistory.findIndex((ntx) => {
                  return ntx.txId === transaction.txId;
                });

                newTxHistory[willChangedTx].poolTxId = ctxResponse.poolTxid;
                setLocalData(newTxHistory);
              }

              if (!ctxResponse) {
                api.getPtx(transaction.txId, poolId).then((ptxResponse) => {
                  if (ptxResponse) {
                    const newTxHistory = [...txHistory];
                    const willChangedTx = newTxHistory.findIndex((ntx) => {
                      return ntx.txId === transaction.txId;
                    });

                    newTxHistory[willChangedTx].completed = true;
                    newTxHistory[willChangedTx].success = true;

                    setLocalData(newTxHistory);
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
            <div className="app-content">
              <Switch component={Fader}>
                <Route exact path={ROUTE_PATH.HOME} component={Home} />
                <Route exact path={ROUTE_PATH.SWAP} component={Swap} />
                <Route exact path={ROUTE_PATH.POOL} component={Pool} />
                <Route exact path={ROUTE_PATH.POOL_DETAIL} component={PoolDetail} />
                <Route exact path={ROUTE_PATH.MY_POOL} component={MyPoolDetail} />
                <Route exact path={ROUTE_PATH.SETTINGS} component={Settings} />
                <Route exact path={ROUTE_PATH.ADD_LIQUIDTY} component={AddLiquidity} />
                <Route exact path={ROUTE_PATH.REMOVE_LIQUIDITY} component={RemoveLiquidity} />
                {/* <Route exact path={ROUTE_PATH.FACTORY} component={Factory} />
              <Route exact path={ROUTE_PATH.ISSUE_TOKEN} component={IssueToken} /> */}
                <Route exact path={ROUTE_PATH.NOT_FOUND} component={NotFound} />
              </Switch>
            </div>
          )}
        </div>
        <Footer />
        <div className="secret-footer-div" />
      </Content>
    </Router>
  );
};
