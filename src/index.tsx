import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import 'rsuite/dist/styles/rsuite-dark.css';
import { CustomProvider } from 'rsuite';
import { AppContextProvider } from './context/utils/combineProviders';
import {
  BtcPriceContextProvider,
  ChartsContextProvider,
  PoolsContextProvider,
  SettingsContextProvider,
  WalletContextProvider,
  TxHistoryContextProvider,
} from './context';
import './style/global.scss';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root') as HTMLElement;

if (!container) throw new Error('Failed to find the root element');

ReactDOM.hydrateRoot(
  container,
  <AppContextProvider
    providers={[
      BtcPriceContextProvider,
      ChartsContextProvider,
      PoolsContextProvider,
      SettingsContextProvider,
      WalletContextProvider,
      TxHistoryContextProvider,
    ]}
  >
    <CustomProvider theme="dark">
      <App />
    </CustomProvider>
  </AppContextProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
