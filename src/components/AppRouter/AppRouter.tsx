import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { api, Wallet } from '@bitmatrix/lib';
import { Pool as ModelPool, BmConfig, BmChart, BmCtxMempool } from '@bitmatrix/models';
import {
  usePoolConfigContext,
  usePoolContext,
  useWalletContext,
  usePoolChartDataContext,
  useSettingsContext,
} from '../../context';
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
import { CreateNewPool } from '../../pages/CreateNewPool/CreateNewPool';
import Switch from 'react-router-transition-switch';
import Fader from 'react-fader';
import { NotFound } from '../../pages/NotFound/NotFound';
import { SELECTED_THEME } from '../../enum/SELECTED_THEME';
import { detectProvider, MarinaProvider } from 'marina-provider';
import { ErrorBoundary } from './ErrorBoundary/ErrorBoundary';
import './AppRouter.scss';
import { deepCopy } from '../../helper';

declare global {
  interface Window {
    marina: MarinaProvider;
  }
}

const exclusiveThemeAssets = ['657447fa93684f04c4bad40c5adfb9aec1531e328371b1c7f2d45f8591dd7b56'];

export const AppRouter = (): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true);
  const { setPoolsContext } = usePoolContext();
  const { walletContext, setWalletContext } = useWalletContext();
  const { settingsContext, setThemeContext, setExclusiveThemesContext } = useSettingsContext();
  const { setPoolConfigContext } = usePoolConfigContext();
  const { setPoolChartDataContext } = usePoolChartDataContext();

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
        const marinaWallet = new Wallet(window.marina);

        marina.isEnabled().then((enabled) => {
          setWalletContext({ marina: marinaWallet, isEnabled: enabled, balances: [] });
        });
      })
      .catch(() => {
        const marinaWallet = new Wallet(window.marina);

        setWalletContext({ marina: marinaWallet, isEnabled: false, balances: [] });
      });
  }, []);

  useEffect(() => {
    if (walletContext?.marina) {
      fetchBalances(walletContext.marina);

      walletContext.marina.on('NEW_UTXO', () => {
        if (walletContext?.marina) {
          fetchBalances(walletContext.marina);
        }
      });

      // setInterval(() => {
      //   if (walletContext) {
      //     walletContext?.marina.getNetwork().then((network: NetworkString) => {
      //       setNetworkContext(network);
      //     });
      //   }
      // }, 1000);

      // payloadData.wallet.marina.reloadCoins();
    }

    // setInterval(() => {
    //   if (payloadData.wallet) {
    //     fetchBalances(payloadData.wallet?.marina);
    //   }
    // }, 60000);
  }, [walletContext?.marina]);

  const fetchBalances = async (wall: Wallet) => {
    if (walletContext && walletContext.isEnabled) {
      wall
        .getBalances()
        .then((balances) => {
          setWalletContext({ marina: wall, isEnabled: true, balances });

          const existExclusiveThemes = exclusiveThemeAssets.filter((value) =>
            balances.some(({ asset }) => value === asset.assetHash),
          );
          const selectedExclusive = existExclusiveThemes.find((exc) => exc === settingsContext.theme);
          const exclusiveAmount = balances.find((bl) => bl.asset.assetHash === selectedExclusive)?.amount;

          if (selectedExclusive) {
            if (!exclusiveAmount || exclusiveAmount === 0) {
              setThemeContext(SELECTED_THEME.NEON);
            }
          }
          setExclusiveThemesContext(existExclusiveThemes);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const fetchData = async (isInitialize: boolean) => {
    const newPool: ModelPool = {
      id: '2e27304eef17c3546eff8c8f85439802bd5a545da701b03f7838c8046a01da95',
      quote: {
        ticker: 'tL-BTC',
        name: 'Liquid Bitcoin',
        asset: '144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49',
        value: '200000',
      },
      token: {
        ticker: 'tL-USDt',
        name: 'Liquid Tether',
        asset: 'f3d1ec678811398cd2ae277cbe3849c6f6dbd72c74bc542f7c4b11ff0e820958',
        value: '100000000000',
      },
      lp: {
        ticker: '402b',
        name: 'unknown',
        asset: '402bb6d457ff10edb630ef80390f327b17dd02179a2ec04bb9259285f84f980d',
        value: '1999998000',
      },
      lastSyncedBlock: {
        block_height: 381436,
        block_hash: '44340f3f93fd21859b1f4a379d172c95b4214dfd6e639d5b7a9fc6d2b669e5e0',
      },
      bestBlockHeight: 385093,
      synced: false,
      initialTx: {
        txid: '3928c154e432f903302ccb9232512837c7db0617b382ac5e9d416eb23ebd715f',
        block_height: 445843,
        block_hash: 'd1ecce31620a28f34d37243e84327472bdb8de0a5dde451836c3b70ed03ce50c',
      },
      unspentTx: {
        txid: '3928c154e432f903302ccb9232512837c7db0617b382ac5e9d416eb23ebd715f',
        block_height: 445843,
        block_hash: 'd1ecce31620a28f34d37243e84327472bdb8de0a5dde451836c3b70ed03ce50c',
      },
      lastSentPtx: '3928c154e432f903302ccb9232512837c7db0617b382ac5e9d416eb23ebd715f',
      active: true,
    };

    setPoolsContext([newPool]);

    // checkLastTxStatus(poolId);

    if (isInitialize) {
      const pool_config: BmConfig = await api.getBmConfigs(
        'd55c1cffed395dac02042c4e4c8a0bc8aff9bb7a9a75fefec4bfa49aae0c83fb',
      );
      const new_config = deepCopy(pool_config);
      new_config.baseFee = { number: 550, hex: '' };
      setPoolConfigContext(new_config);
    }

    if (location.pathname.startsWith('/pool') || isInitialize) {
      const pool_chart_data: BmChart[] = await api.getPoolChartData(
        'd55c1cffed395dac02042c4e4c8a0bc8aff9bb7a9a75fefec4bfa49aae0c83fb',
      );

      setPoolChartDataContext(pool_chart_data);
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
            api.getCtxMempool(transaction.txId, poolId).then((ctxResponse: BmCtxMempool) => {
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
                    newTxHistory[willChangedTx].isOutOfSlippage = ptxResponse.isOutOfSlippage;

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
      <ErrorBoundary>
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
                  <Route exact path={ROUTE_PATH.CREATE_NEW_POOL} component={CreateNewPool} />
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
      </ErrorBoundary>
    </Router>
  );
};
