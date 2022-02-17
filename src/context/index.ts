import { usePoolChartDataContext } from './poolChartData';
import { poolChartDataReducer } from './poolChartData/reducer';
import { usePoolConfigContext } from './poolConfig';
import { poolConfigReducer } from './poolConfig/reducer';
import { usePoolContext } from './pools';
import { poolsReducer } from './pools/reducer';
import { useSettingsContext } from './settings';
import { settingsReducer } from './settings/reducer';
import { combineComponents } from './utils/combineReducer';
import { useWalletContext } from './wallet';
import { walletReducer } from './wallet/reducer';

export const AppContextProvider = combineComponents(
  poolsReducer as any,
  poolChartDataReducer as any,
  poolConfigReducer as any,
  settingsReducer as any,
  walletReducer as any,
);

export { usePoolContext, useWalletContext, usePoolConfigContext, usePoolChartDataContext, useSettingsContext };
