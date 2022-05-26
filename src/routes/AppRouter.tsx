import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Wallet, api } from '@bitmatrix/lib';
import { Pool as ModelPool, BmCtxMempool } from '@bitmatrix/models';
import { usePoolContext, useWalletContext, useSettingsContext } from '../context';
import { ROUTE_PATH } from '../enum/ROUTE_PATH';
import { Swap } from '../pages/Swap/Swap';
import { Footer } from '../components/Footer/Footer';
import { Navbar } from '../components/Navbar/Navbar';
import { Home } from '../pages/Home/Home';
import { PoolPage } from '../pages/Pool/Pool';
// import { Factory } from '../../pages/Factory/Factory';
// import { IssueToken } from '../../pages/Factory/Issuance/IssueToken/IssueToken';
import { Content, Loader } from 'rsuite';
import { Settings } from '../pages/Settings/Settings';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { CommitmentStore } from '../model/CommitmentStore';
import RemoveLiquidity from '../pages/Liquidity/RemoveLiquidity/RemoveLiquidity';
import AddLiquidity from '../pages/Liquidity/AddLiquidity/AddLiquidity';
import { PoolDetail } from '../pages/PoolDetail/PoolDetail';
import { MyPoolDetail } from '../pages/PoolDetail/MyPoolDetail/MyPoolDetail';
import { CreateNewPool } from '../pages/CreateNewPool/CreateNewPool';
import Switch from 'react-router-transition-switch';
import Fader from 'react-fader';
import { NotFound } from '../pages/NotFound/NotFound';
import { SELECTED_THEME } from '../enum/SELECTED_THEME';
import { detectProvider } from 'marina-provider';
import { ErrorBoundary } from '../components/ErrorBoundary/ErrorBoundary';
import './AppRouter.scss';

const exclusiveThemeAssets = ['657447fa93684f04c4bad40c5adfb9aec1531e328371b1c7f2d45f8591dd7b56'];

const mockPools: ModelPool[] = [
  {
    id: 'd55c1cffed395dac02042c4e4c8a0bc8aff9bb7a9a75fefec4bfa49aae0c83fb',
    quote: {
      ticker: 'tL-BTC',
      name: 'Liquid Testnet Bitcoin',
      assetHash: '144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49',
      value: '3852510269',
    },
    token: {
      ticker: 'tL-USDt',
      name: 'Liquid Testnet Tether',
      assetHash: 'f3d1ec678811398cd2ae277cbe3849c6f6dbd72c74bc542f7c4b11ff0e820958',
      value: '124096791000000',
    },
    lp: {
      ticker: 'tL-BTC:tL-USDt:0',
      name: 'Liquid Testnet LP: Bitcoin:Tether:3 Liquidty Provider',
      assetHash: 'afd89e5dc9e11e78f7482a5b6aeaac7d41854758d9879b946023cbfa130b6908',
      value: '1983947548',
    },
    initialTx: {
      txid: 'e85b7e376d40b5029a16546555d22398b0168c86768d9f53701976a054b242a6',
      block_hash: 'fac4c35dd58fa5a337f04b02e4e1b2966df3e3d45ae2d3edbb87efde7c464fb9',
      block_height: 1983624303,
    },
    lastSyncedBlock: {
      block_height: 358138,
      block_hash: '58d4bfcb22dc757d2deac836fba059c619ea615c520cb47fde54eefcd82374c2',
    },
    unspentTx: {
      txid: '6221fbcd3f09aae78b0acaacfb834d8cfe58eaf2b0e4a2bd7011d19d25d788fa',
      block_hash: '8f3283337c8c571ee76c8e01027bce42335f930b0a20ebc88b93adbb5fa40c11',
      block_height: 358070,
    },
    bestBlockHeight: 358138,
    synced: true,
    active: true,
    lastSentPtx: '',
    usdPrice: 35000,
    tvl: {
      value: 2600465.72,
      rate: { value: '2.91', direction: 'up' },
    },
    volume: {
      value: 272601,
      rate: { value: '714.90', direction: 'up' },
    },
    fees: {
      value: 545.202,
      rate: { value: '714.90', direction: 'up' },
    },
    price: {
      value: 35408.36037263298,
      rate: { value: '5.93', direction: 'up' },
      allPriceData: [
        { close: 2324, date: '2022-02-02' },
        { close: 3146, date: '2022-02-07' },
        { close: 32897, date: '2022-05-24' },
      ],
    },
  },
  {
    id: '0bc48e957a11bb1fd50c6297c98225b8687b61f1af87a8ac625f5e5e5c6e3585',
    quote: {
      ticker: 'tL-BTC',
      name: 'Liquid Testnet Bitcoin',
      assetHash: '144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49',
      value: '23468441280',
    },
    token: {
      ticker: 'tL-USDt',
      name: 'Liquid Testnet Tether',
      assetHash: 'f3d1ec678811398cd2ae277cbe3849c6f6dbd72c74bc542f7c4b11ff0e820958',
      value: '769146007000000',
    },
    lp: {
      ticker: 'tL-BTC:tL-USDt:0',
      name: 'Liquid Testnet LP: Bitcoin:Tether:3 Liquidty Provider',
      assetHash: 'e720cb147bcb6777b08969ce9ba14cb376d84ea11c7edd4196a912ee9947ce2b',
      value: '1825367664',
    },
    initialTx: {
      txid: '61013008fd4c9138ac4ed25534b7222b93d10440f36ce78a1e9b9a23cb16a563',
      block_hash: '3385d48b447135665195486dbea99f79c681427f8b2607bbe1233c2e6c8ad62d',
      block_height: 171658,
    },
    lastSyncedBlock: {
      block_height: 354691,
      block_hash: '93fd1d29981f076ec4d47cf8a08e77413895889a17a04564d9cf57eed8e7922d',
    },
    bestBlockHeight: 354691,
    synced: true,
    active: true,
    unspentTx: {
      txid: '6f4099cfa11f9049b422a6c2f17210d312215a0ca0312058c4927f7c50cf6c85',
      block_hash: 'd7f7503045108a6239ebb16ce2008fc22b3cd2f46311077d3e76cefbbbb21ab0',
      block_height: 230544,
    },
    lastSentPtx: '',
    usdPrice: 30000,
    tvl: {
      value: 2600465.72,
      rate: { value: '2.91', direction: 'up' },
    },
    volume: {
      value: 272601,
      rate: { value: '714.90', direction: 'up' },
    },
    fees: {
      value: 545.202,
      rate: { value: '714.90', direction: 'up' },
    },
    price: {
      value: 35408.36037263298,
      rate: { value: '5.93', direction: 'up' },
      allPriceData: [
        { close: 2324, date: '2022-02-02' },
        { close: 3146, date: '2022-02-07' },
        { close: 32897, date: '2022-05-24' },
      ],
    },
  },
];

export const AppRouter = (): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true);
  const { setPoolsContext } = usePoolContext();
  const { walletContext, setWalletContext } = useWalletContext();
  const { settingsContext, setThemeContext, setExclusiveThemesContext } = useSettingsContext();
  // const { setPoolConfigContext } = usePoolConfigContext();
  // const { setPoolChartDataContext } = usePoolChartDataContext();

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
          setWalletContext({ marina: marinaWallet, isEnabled: enabled, balances: [] });
        });
      })
      .catch(() => {
        const marinaWallet = new Wallet();

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
      setPoolsContext(mockPools);
    }
    checkLastTxStatus(mockPools[0].id);
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
                  <Route exact path={ROUTE_PATH.POOL} component={PoolPage} />
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
