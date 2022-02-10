/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SettingsStore } from '../model/SettingsStore';
import SETTINGS_ACTION_TYPES from './SETTINGS_ACTION_TYPES';
import PayloadData from './PayloadData';

const { setLocalData } = useLocalStorage<SettingsStore>('BmSettings');

const reducer = (
  state: PayloadData,
  action: {
    type: SETTINGS_ACTION_TYPES;
    payload: PayloadData;
  },
) => {
  switch (action.type) {
    case SETTINGS_ACTION_TYPES.SET_SLIPPAGE:
      setLocalData({
        slippage: action.payload.slippage,
        preferred_unit: state.preferred_unit,
      });
      return {
        ...state,
        slippage: action.payload.slippage,
      };

    case SETTINGS_ACTION_TYPES.SET_PREFERRED_UNIT:
      setLocalData({
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

    default:
      return state;
  }
};

export default reducer;
