/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { PREFERRED_UNIT } from '../enum/PREFERRED_UNIT';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SettingsStore } from '../model/SettingsStore';
import SETTINGS_ACTION_TYPES from './SETTINGS_ACTION_TYPES';
import PayloadData from './PayloadData';
import { PREFERRED_UNIT_VALUE } from '../enum/PREFERRED_UNIT_VALUE';

const { getLocalData, setLocalData } = useLocalStorage<SettingsStore>('BmSettings');
const settings = getLocalData();

const reducer = (
  state: PayloadData = {
    slippage: settings?.slippage || 200,
    preferred_unit: settings?.preferred_unit || { text: PREFERRED_UNIT.LBTC, value: PREFERRED_UNIT_VALUE.LBTC },
  },
  action: {
    type: SETTINGS_ACTION_TYPES;
    payload: PayloadData;
  },
) => {
  switch (action.type) {
    case SETTINGS_ACTION_TYPES.SET_SLIPPAGE:
      setLocalData({
        slippage: action.payload.slippage,
        preferred_unit: settings?.preferred_unit || { text: PREFERRED_UNIT.LBTC, value: PREFERRED_UNIT_VALUE.LBTC },
      });
      return {
        ...state,
        slippage: action.payload.slippage,
      };

    case SETTINGS_ACTION_TYPES.SET_PREFERRED_UNIT:
      setLocalData({
        slippage: settings?.slippage || 200,
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

    default:
      return state;
  }
};

export default reducer;
