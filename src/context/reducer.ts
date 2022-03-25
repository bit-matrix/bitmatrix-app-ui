/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SettingsStore } from '../model/SettingsStore';
import SETTINGS_ACTION_TYPES from './SETTINGS_ACTION_TYPES';
import PayloadData from './PayloadData';
import { SELECTED_THEME } from '../enum/SELECTED_THEME';

const { setLocalData: setSettings } = useLocalStorage<SettingsStore>('BmSettings');
const { setLocalData: setTheme } = useLocalStorage<SELECTED_THEME>('theme');

const reducer = (
  state: PayloadData,
  action: {
    type: SETTINGS_ACTION_TYPES;
    payload: PayloadData;
  },
) => {
  switch (action.type) {
    case SETTINGS_ACTION_TYPES.SET_SLIPPAGE:
      setSettings({
        slippage: action.payload.slippage,
        preferred_unit: state.preferred_unit,
      });
      return {
        ...state,
        slippage: action.payload.slippage,
      };

    case SETTINGS_ACTION_TYPES.SET_PREFERRED_UNIT:
      setSettings({
        slippage: state.slippage,
        preferred_unit: action.payload.preferred_unit,
      });
      return {
        ...state,
        preferred_unit: action.payload.preferred_unit,
      };

    case SETTINGS_ACTION_TYPES.SET_POOLS:
      return {
        ...state,
        pools: action.payload.pools,
      };

    case SETTINGS_ACTION_TYPES.SET_POOL_CONFIG:
      return {
        ...state,
        pool_config: action.payload.pool_config,
      };

    case SETTINGS_ACTION_TYPES.SET_WALLET:
      return {
        ...state,
        wallet: action.payload.wallet,
      };

    case SETTINGS_ACTION_TYPES.SET_POOL_CHART_DATA:
      return {
        ...state,
        pool_chart_data: action.payload.pool_chart_data,
      };

    case SETTINGS_ACTION_TYPES.SET_THEME:
      setTheme(action.payload.theme);
      document.documentElement.setAttribute('theme', action.payload.theme);
      return {
        ...state,
        theme: action.payload.theme,
      };

    default:
      return state;
  }
};

export default reducer;
