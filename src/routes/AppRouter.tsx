import { useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Wallet, api } from '@bitmatrix/lib';
import { BmConfig } from '@bitmatrix/models';
import { usePoolsSocket } from '../hooks/usePoolsSocket';
import { useWalletContext, useSettingsContext, usePoolConfigContext, usePoolContext } from '../context';
import { ROUTE_PATH } from '../enum/ROUTE_PATH';
import { Swap3 } from '../pages/Swap3/Swap3';
import { Footer } from '../components/Footer/Footer';
import { Navbar } from '../components/Navbar/Navbar';
import { Home } from '../pages/Home/Home';
import { PoolPage } from '../pages/Pool/Pool';
// import { Factory } from '../../pages/Factory/Factory';
// import { IssueToken } from '../../pages/Factory/Issuance/IssueToken/IssueToken';
import { Content, Loader } from 'rsuite';
import { Settings } from '../pages/Settings/Settings';
// import { useLocalStorage } from '../hooks/useLocalStorage';
// import { CommitmentStore } from '../model/CommitmentStore';
import RemoveLiquidity2 from '../pages/Liquidity/RemoveLiquidity2/RemoveLiquidity2';
import AddLiquidity2 from '../pages/Liquidity/AddLiquidity2/AddLiquidity2';
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

const exclusiveThemeAssets = ['657447fa93684f04c4bad40c5adfb9aec1531e328371b1c7f2d45f8591dd7b56'];

export const AppRouter = (): JSX.Element => {
  // const [loading, setLoading] = useState<boolean>(true);
  const { setPoolsContext } = usePoolContext();
  const { walletContext, setWalletContext } = useWalletContext();
  const { settingsContext, setThemeContext, setExclusiveThemesContext } = useSettingsContext();
  const { setPoolConfigContext } = usePoolConfigContext();

  const { poolsLoading, pools } = usePoolsSocket();

  // const { setPoolChartDataContext } = usePoolChartDataContext();

  // const { getLocalData, setLocalData } = useLocalStorage<CommitmentStore[]>('BmTxV3');

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
    if (isInitialize) {
      // const pools: ModelPool[] = await api.getPools();
      const pool_config: BmConfig = await api.getBmConfigs();
      setPoolConfigContext(pool_config);

      // setPoolsContext(pools);
    }
    // checkLastTxStatus(pools[0].id);
    // setLoading(false);
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
            {poolsLoading ? (
              <div id="loaderInverseWrapper" style={{ height: 200 }}>
                <Loader size="md" inverse center content={<span>Loading...</span>} vertical />
              </div>
            ) : (
              <div className="app-content">
                <Switch component={Fader}>
                  <Route exact path={ROUTE_PATH.HOME} component={Home} />
                  <Route exact path={ROUTE_PATH.SWAP} component={Swap3} />
                  <Route exact path={ROUTE_PATH.POOL} component={PoolPage} />
                  <Route exact path={ROUTE_PATH.POOL_DETAIL} component={PoolDetail} />
                  <Route exact path={ROUTE_PATH.MY_POOL} component={MyPoolDetail} />
                  <Route exact path={ROUTE_PATH.CREATE_NEW_POOL} component={CreateNewPool} />
                  <Route exact path={ROUTE_PATH.SETTINGS} component={Settings} />
                  <Route exact path={ROUTE_PATH.ADD_LIQUIDTY} component={AddLiquidity2} />
                  <Route exact path={ROUTE_PATH.REMOVE_LIQUIDITY} component={RemoveLiquidity2} />
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
