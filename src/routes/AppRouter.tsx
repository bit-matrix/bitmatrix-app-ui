import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Wallet, api } from '@bitmatrix/lib';
import { BmConfig } from '@bitmatrix/models';
import { usePoolsSocket } from '../hooks/usePoolsSocket';
import { useTxStatusSocket } from '../hooks/useTxStatusSocket';
import { useWalletContext, useSettingsContext, usePoolConfigContext, usePoolContext } from '../context';
import { ROUTE_PATH } from '../enum/ROUTE_PATH';
import { Swap } from '../pages/Swap/Swap';
import { Footer } from '../components/Footer/Footer';
import { Navbar } from '../components/Navbar/Navbar';
import { Home } from '../pages/Home/Home';
import { PoolPage } from '../pages/Pool/Pool';
import { Content, Loader } from 'rsuite';
import { Settings } from '../pages/Settings/Settings';
import RemoveLiquidity from '../pages/Liquidity/RemoveLiquidity/RemoveLiquidity';
import AddLiquidity from '../pages/Liquidity/AddLiquidity/AddLiquidity';
import { PoolDetail } from '../pages/PoolDetail/PoolDetail';
import { MyPoolDetail } from '../pages/PoolDetail/MyPoolDetail/MyPoolDetail';
import { CreateNewPool } from '../pages/CreateNewPool/CreateNewPool';
import Switch from 'react-router-transition-switch';
import Fader from 'react-fader';
import { detectProvider, MarinaProvider } from 'marina-provider';
import { SELECTED_THEME } from '../enum/SELECTED_THEME';
import { ErrorBoundary } from '../components/ErrorBoundary/ErrorBoundary';
import { NotFound } from '../pages/NotFound/NotFound';
import './AppRouter.scss';

declare global {
  interface Window {
    marina: MarinaProvider;
  }
}

// enum TX_STATUS {
//   PENDING,
//   WAITING_PTX,
//   WAITING_PTX_CONFIRM,
//   SUCCESS,
//   FAILED,
// }

const exclusiveThemeAssets = ['657447fa93684f04c4bad40c5adfb9aec1531e328371b1c7f2d45f8591dd7b56'];

export const AppRouter = (): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true);
  const { setPoolsContext } = usePoolContext();
  const { walletContext, setWalletContext } = useWalletContext();
  const { settingsContext, setThemeContext, setExclusiveThemesContext } = useSettingsContext();
  const { setPoolConfigContext } = usePoolConfigContext();
  const { poolsLoading, pools, isPoolsConnected } = usePoolsSocket();
  const { txStatues, txStatusLoading } = useTxStatusSocket();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    checkTxStatues();
  }, [txStatues]);

  useEffect(() => {
    if (poolsLoading === false && pools) {
      setPoolsContext(pools);
    }
  }, [pools, poolsLoading]);

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
    }
  }, [walletContext?.marina]);

  const checkTxStatues = () => {
    // const txHistory = getLocalData();
    // if (txHistory && txHistory.length > 0) {
    //   if (unconfirmedTxs && unconfirmedTxs.length > 0) {
    //     const newTxHistory = [...txHistory];
    //     if (txStatues) {
    //       txStatues.forEach((txStatus) => {
    //         const willChangeTxIndex = newTxHistory.findIndex((txh) => txh.txId === txStatus.txId);
    //         if (willChangeTxIndex > -1) {
    //           if (txStatus.status === TX_STATUS.SUCCESS) {
    //             newTxHistory[willChangeTxIndex].completed = true;
    //           }
    //           if (txStatus.status === TX_STATUS.FAILED) {
    //             newTxHistory[willChangeTxIndex].completed = true;
    //             newTxHistory[willChangeTxIndex].isOutOfSlippage = true;
    //           }
    //           if (
    //             txStatus.status === TX_STATUS.PENDING ||
    //             txStatus.status === TX_STATUS.WAITING_PTX ||
    //             txStatus.status === TX_STATUS.WAITING_PTX_CONFIRM
    //           ) {
    //             newTxHistory[willChangeTxIndex].completed = false;
    //           }
    //           setLocalData(newTxHistory);
    //         }
    //       });
    //     }
    //   }
    // }
  };

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

  const fetchData = async () => {
    const pool_config: BmConfig = await api.getBmConfigs();
    setPoolConfigContext(pool_config);
    setLoading(false);
  };

  // const checkLastTxStatus = (poolId: string) => {
  //   const txHistory = getLocalData();
  //   if (txHistory && txHistory.length > 0) {
  //     const unconfirmedTxs = txHistory.filter((utx) => utx.completed === false);
  //     if (unconfirmedTxs.length > 0) {
  //       unconfirmedTxs.forEach((transaction) => {
  //         if (transaction.txId) {
  //           api.getCtxMempool(transaction.txId, poolId).then((ctxResponse: BmCtxMempool) => {
  //             if (ctxResponse) {
  //               const newTxHistory = [...txHistory];
  //               const willChangedTx = newTxHistory.findIndex((ntx) => {
  //                 return ntx.txId === transaction.txId;
  //               });
  //               newTxHistory[willChangedTx].poolTxId = ctxResponse.poolTxid;
  //               setLocalData(newTxHistory);
  //             }
  //             if (!ctxResponse) {
  //               api.getPtx(transaction.txId, poolId).then((ptxResponse) => {
  //                 if (ptxResponse) {
  //                   const newTxHistory = [...txHistory];
  //                   const willChangedTx = newTxHistory.findIndex((ntx) => {
  //                     return ntx.txId === transaction.txId;
  //                   });
  //                   newTxHistory[willChangedTx].completed = true;
  //                   newTxHistory[willChangedTx].isOutOfSlippage = ptxResponse.isOutOfSlippage;
  //                   setLocalData(newTxHistory);
  //                 }
  //               });
  //             }
  //           });
  //         }
  //       });
  //     }
  //   }
  // };

  return (
    <Router>
      <ErrorBoundary>
        <Content className="app-router-main">
          <div className="secret-top-div" />
          <Navbar />
          <div className="app-container">
            {poolsLoading || txStatusLoading || loading ? (
              <div id="loaderInverseWrapper" style={{ height: 200 }}>
                <Loader size="md" inverse center content={<span>Loading...</span>} vertical />
              </div>
            ) : (
              <div className="app-content">
                {isPoolsConnected ? (
                  <Switch component={Fader}>
                    <Route exact path={ROUTE_PATH.HOME} component={Home} />
                    <Route exact path={ROUTE_PATH.SWAP} component={Swap} />
                    <Route exact path={ROUTE_PATH.POOL} component={PoolPage} />
                    <Route exact path={ROUTE_PATH.POOL_DETAIL} component={PoolDetail} />
                    <Route exact path={ROUTE_PATH.MY_POOL} component={MyPoolDetail} />
                    <Route exact path={ROUTE_PATH.CREATE_NEW_POOL} component={CreateNewPool} />
                    <Route exact path={ROUTE_PATH.SETTINGS} component={Settings} />
                    <Route exact path={ROUTE_PATH.ADD_LIQUIDTY} component={AddLiquidity} />
                    <Route exact path={ROUTE_PATH.REMOVE_LIQUIDITY} component={RemoveLiquidity} />
                    <Route exact path={ROUTE_PATH.NOT_FOUND} component={NotFound} />
                  </Switch>
                ) : (
                  <div className="error-content">Socket connection error</div>
                )}
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
