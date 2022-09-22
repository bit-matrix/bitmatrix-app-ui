import { useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Wallet } from '@bitmatrix/lib';
import { TX_STATUS } from '@bitmatrix/models';
import { usePoolsSocket } from '../hooks/usePoolsSocket';
import { useWalletContext, useSettingsContext, useTxHistoryContext } from '../context';
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
import { Swap } from '../pages/Swap/Swap';
import './AppRouter.scss';
import { BANANA_THEME_ASSET, IS_TESTNET } from '../env';
import { notify } from '../components/utils/utils';

declare global {
  interface Window {
    marina: MarinaProvider;
  }
}

const exclusiveThemeAssets = [BANANA_THEME_ASSET];

export const AppRouter = (): JSX.Element => {
  const { walletContext, setWalletContext } = useWalletContext();
  const { settingsContext, setThemeContext, setExclusiveThemesContext } = useSettingsContext();
  const { poolsLoading, isPoolsConnected } = usePoolsSocket();
  const { chartsLoading, isChartsConnected, txStatuses, txStatusesLoading, checkTxStatusWithIds } = useChartsSocket();
  const { txHistoryContext, setTxHistoryContext } = useTxHistoryContext();

  useEffect(() => {
    detectProvider('marina')
      .then(async (marina) => {
        const marinaWallet = new Wallet(window.marina);

        const network = await marinaWallet.getNetwork();
        if (IS_TESTNET ? network !== 'testnet' : network !== 'liquid') {
          notify('Please check your network in wallet.', 'Wallet Network Error : ');
        }

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

      walletContext.marina.on('NETWORK', ({ data }) => {
        if (IS_TESTNET ? data !== 'testnet' : data !== 'liquid') {
          notify('Please check your network in wallet.', 'Wallet Network Error : ');
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletContext?.marina]);

  useEffect(() => {
    if (txHistoryContext && txHistoryContext.length > 0 && txStatuses) {
      const newLocalStorageData = [...txHistoryContext];

      txStatuses.forEach((ts) => {
        const currentTxIndex = newLocalStorageData.findIndex((lt) => lt.txId === ts.txId);

        const currentData = newLocalStorageData[currentTxIndex];
        currentData.poolTxId = ts.poolTxId;
        currentData.txStatus = ts.status;
        if (ts.status === TX_STATUS.FAILED || ts.status === TX_STATUS.SUCCESS) {
          currentData.completed = true;
        }
        if (ts.errorMessages) currentData.errorMessage = ts.errorMessages;
      });
      const sortedHistoryData = newLocalStorageData.sort((a, b) => a.timestamp - b.timestamp);
      setTxHistoryContext(sortedHistoryData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txStatuses]);

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

  return (
    <Router>
      <ErrorBoundary>
        <Content className="app-router-main">
          <div className="secret-top-div" />
          <Navbar />
          <div className="app-container">
            {poolsLoading || chartsLoading || txStatusesLoading ? (
              <div id="loaderInverseWrapper" style={{ height: 200 }}>
                <Loader size="md" inverse center content={<span>Loading...</span>} vertical />
              </div>
            ) : (
              <div className="app-content">
                {isPoolsConnected && isChartsConnected ? (
                  <Switch component={Fader}>
                    <Route exact path={ROUTE_PATH.HOME} component={Home} />
                    <Route exact path={ROUTE_PATH.SWAP}>
                      <Swap checkTxStatusWithIds={checkTxStatusWithIds}></Swap>
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
