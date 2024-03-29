import App from './App';
import reportWebVitals from './reportWebVitals';
// import 'rsuite/dist/styles/rsuite-dark.css';
import { CustomProvider } from 'rsuite';
import { AppContextProvider } from './context/utils/combineProviders';
import { createRoot } from 'react-dom/client';
import {
  BtcPriceContextProvider,
  ChartsContextProvider,
  PoolsContextProvider,
  SettingsContextProvider,
  WalletContextProvider,
  TxHistoryContextProvider,
} from './context';
import './style/global.scss';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
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
