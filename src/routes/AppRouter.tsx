import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Wallet } from '@bitmatrix/lib';
import { TX_STATUS } from '@bitmatrix/models';
import { usePoolsSocket } from '../hooks/usePoolsSocket';
import { useWalletContext, useSettingsContext, usePoolConfigContext } from '../context';
import { ROUTE_PATH } from '../enum/ROUTE_PATH';
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
import { Balance, detectProvider, MarinaProvider, Utxo } from 'marina-provider';
import { SELECTED_THEME } from '../enum/SELECTED_THEME';
import { ErrorBoundary } from '../components/ErrorBoundary/ErrorBoundary';
import { NotFound } from '../pages/NotFound/NotFound';
import { useChartsSocket } from '../hooks/useChartsSocket';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { CommitmentStore } from '../model/CommitmentStore';
import { testnetConfig } from '../config/testnet';
import './AppRouter.scss';
import { Swap2 } from '../pages/Swap/Swap2';

declare global {
  interface Window {
    marina: MarinaProvider;
  }
}

const exclusiveThemeAssets = ['657447fa93684f04c4bad40c5adfb9aec1531e328371b1c7f2d45f8591dd7b56'];

export const AppRouter = (): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true);
  const { walletContext, setWalletContext } = useWalletContext();
  const { settingsContext, setThemeContext, setExclusiveThemesContext } = useSettingsContext();
  const { setPoolConfigContext } = usePoolConfigContext();
  const { poolsLoading, isPoolsConnected } = usePoolsSocket();
  const { chartsLoading, isChartsConnected, txStatuses, txStatusesLoading, checkTxStatusWithIds } = useChartsSocket();
  const { getLocalData, setLocalData } = useLocalStorage<CommitmentStore[]>('BmTxV4');

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    detectProvider('marina')
      .then((marina) => {
        const marinaWallet = new Wallet(window.marina);

        marina.isEnabled().then((enabled) => {
          setWalletContext({ marina: marinaWallet, isEnabled: enabled, balances: [], coins: [] });
        });
      })
      .catch(() => {
        const marinaWallet = new Wallet(window.marina);

        setWalletContext({ marina: marinaWallet, isEnabled: false, balances: [], coins: [] });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletContext?.marina]);

  useEffect(() => {
    const localStorageData = getLocalData();

    if (localStorageData && localStorageData.length > 0 && txStatuses) {
      const newLocalStorageData = [...localStorageData];

      txStatuses.forEach((ts) => {
        const currentTxIndex = newLocalStorageData.findIndex((lt) => lt.txId === ts.txId);
        const currentData = newLocalStorageData[currentTxIndex];
        currentData.poolTxId = ts.poolTxId;
        currentData.completed = ts.status === TX_STATUS.SUCCESS || ts.status === TX_STATUS.FAILED ? true : false;
        if (ts.errorMessages) currentData.errorMessage = ts.errorMessages;
      });

      setLocalData(newLocalStorageData);
    }
  }, [getLocalData, setLocalData, txStatuses]);

  const fetchBalances = async (wall: Wallet) => {
    if (walletContext && walletContext.isEnabled) {
      const balances = new Promise<Balance[]>((resolve, reject) => {
        wall
          .getBalances()
          .then((balances) => {
            resolve(balances);
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
      const coins = new Promise<Utxo[]>((resolve, reject) => {
        wall
          .getCoins()
          .then((coins: Utxo[]) => {
            resolve(coins);
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });

      Promise.all([balances, coins]).then((values: [Balance[], Utxo[]]) => {
        setWalletContext({ marina: wall, isEnabled: true, balances: values[0], coins: values[1] });

        const existExclusiveThemes = exclusiveThemeAssets.filter((value) =>
          values[0].some(({ asset }) => value === asset.assetHash),
        );
        const selectedExclusive = existExclusiveThemes.find((exc) => exc === settingsContext.theme);
        const exclusiveAmount = values[0].find((bl) => bl.asset.assetHash === selectedExclusive)?.amount;

        if (selectedExclusive) {
          if (!exclusiveAmount || exclusiveAmount === 0) {
            setThemeContext(SELECTED_THEME.NEON);
          }
        }
        setExclusiveThemesContext(existExclusiveThemes);
      });
    }
  };

  const fetchData = async () => {
    // const pool_config: BmConfig = await api.getBmConfigs();
    setPoolConfigContext(testnetConfig);
    setLoading(false);
  };

  return (
    <Router>
      <ErrorBoundary>
        <Content className="app-router-main">
          <div className="secret-top-div" />
          <Navbar />
          <div className="app-container">
            {poolsLoading || loading || chartsLoading || txStatusesLoading ? (
              <div id="loaderInverseWrapper" style={{ height: 200 }}>
                <Loader size="md" inverse center content={<span>Loading...</span>} vertical />
              </div>
            ) : (
              <div className="app-content">
                {isPoolsConnected && isChartsConnected ? (
                  <Switch component={Fader}>
                    <Route exact path={ROUTE_PATH.HOME} component={Home} />
                    <Route exact path={ROUTE_PATH.SWAP}>
                      <Swap2 checkTxStatusWithIds={checkTxStatusWithIds}></Swap2>
                    </Route>
                    <Route exact path={ROUTE_PATH.POOL} component={PoolPage} />
                    <Route exact path={ROUTE_PATH.POOL_DETAIL} component={PoolDetail} />
                    <Route exact path={ROUTE_PATH.MY_POOL} component={MyPoolDetail} />
                    <Route exact path={ROUTE_PATH.CREATE_NEW_POOL} component={CreateNewPool} />
                    <Route exact path={ROUTE_PATH.SETTINGS} component={Settings} />
                    <Route exact path={ROUTE_PATH.ADD_LIQUIDTY}>
                      <AddLiquidity checkTxStatusWithIds={checkTxStatusWithIds} />
                    </Route>
                    <Route exact path={ROUTE_PATH.REMOVE_LIQUIDITY}>
                      <RemoveLiquidity checkTxStatusWithIds={checkTxStatusWithIds} />
                    </Route>
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
