import React from 'react';
import ReactDOM from 'react-dom';
import './style/global.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import 'rsuite/dist/styles/rsuite-dark.css';
import { CustomProvider } from 'rsuite';
import { AppContextProvider } from './context/utils/combineProviders';
import {
  PoolChartDataContextProvider,
  PoolConfigContextProvider,
  PoolsContextProvider,
  SettingsContextProvider,
  WalletContextProvider,
} from './context';

ReactDOM.render(
  <AppContextProvider
    providers={[
      PoolsContextProvider,
      PoolChartDataContextProvider,
      PoolConfigContextProvider,
      SettingsContextProvider,
      WalletContextProvider,
    ]}
  >
    <CustomProvider theme="dark">
      <App />
    </CustomProvider>
  </AppContextProvider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
