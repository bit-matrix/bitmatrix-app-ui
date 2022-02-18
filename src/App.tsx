import React from 'react';
import { AppRouter } from './components/AppRouter/AppRouter';
import { AppContextProvider } from './context/utils/combineProviders';
import {
  PoolChartDataContextProvider,
  PoolConfigContextProvider,
  PoolsContextProvider,
  SettingsContextProvider,
  WalletContextProvider,
} from './context';
import './App.scss';

const App = (): JSX.Element => {
  return (
    <AppContextProvider
      providers={[
        PoolsContextProvider,
        PoolChartDataContextProvider,
        PoolConfigContextProvider,
        SettingsContextProvider,
        WalletContextProvider,
      ]}
    >
      <AppRouter />
    </AppContextProvider>
  );
};

export default App;
