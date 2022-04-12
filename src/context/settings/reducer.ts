import { Reducer } from 'react';
import { EXPLORER } from '../../enum/EXPLORER';
import { PREFERRED_UNIT } from '../../enum/PREFERRED_UNIT';
import { PREFERRED_UNIT_VALUE } from '../../enum/PREFERRED_UNIT_VALUE';
import { SELECTED_THEME } from '../../enum/SELECTED_THEME';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { SettingsStore } from '../../model/SettingsStore';

import {
  SetExclusiveThemesAction,
  SetExplorerAction,
  SetNetworkAction,
  SetPreferredUnitAction,
  SetSlippageAction,
  SetThemeAction,
  Settings,
} from './types';

const { getLocalData, setLocalData } = useLocalStorage<SettingsStore>('BMXSettings');
const settings = getLocalData();

export const initialSettingsState: Settings = {
  slippage: settings?.slippage || 200,
  preferred_unit: settings?.preferred_unit || { text: PREFERRED_UNIT.LBTC, value: PREFERRED_UNIT_VALUE.LBTC },
  theme: settings?.theme || SELECTED_THEME.NEON,
  exclusiveThemes: [],
  explorer: settings?.explorer || EXPLORER.MEMPOOL,
  network: 'testnet',
};

export const settingsReducer: Reducer<
  Settings,
  | SetPreferredUnitAction
  | SetSlippageAction
  | SetThemeAction
  | SetExclusiveThemesAction
  | SetExplorerAction
  | SetNetworkAction
> = (
  state: Settings = initialSettingsState,
  action:
    | SetPreferredUnitAction
    | SetSlippageAction
    | SetThemeAction
    | SetExclusiveThemesAction
    | SetExplorerAction
    | SetNetworkAction,
): Settings => {
  switch (action.type) {
    case 'SET_SLIPPAGE':
      setLocalData({
        slippage: action.payload,
        preferred_unit: state.preferred_unit,
        theme: state.theme,
        explorer: state.explorer,
      });
      return {
        ...state,
        slippage: action.payload,
      };

    case 'SET_PREFERRED_UNIT':
      setLocalData({
        slippage: state.slippage,
        preferred_unit: action.payload,
        theme: state.theme,
        explorer: state.explorer,
      });

      return {
        ...state,
        preferred_unit: action.payload,
      };

    case 'SET_THEME':
      setLocalData({
        slippage: state.slippage,
        preferred_unit: state.preferred_unit,
        theme: action.payload,
        explorer: state.explorer,
      });

      document.documentElement.setAttribute('theme', action.payload);

      return {
        ...state,
        theme: action.payload,
      };

    case 'SET_EXCLUSIVE_THEMES':
      return {
        ...state,
        exclusiveThemes: [...action.payload],
      };

    case 'SET_EXPLORER':
      setLocalData({
        slippage: state.slippage,
        preferred_unit: state.preferred_unit,
        theme: state.theme,
        explorer: action.payload,
      });

      return {
        ...state,
        explorer: action.payload,
      };

    case 'SET_NETWORK':
      return {
        ...state,
        network: action.payload,
      };

    default:
      return state;
  }
};
