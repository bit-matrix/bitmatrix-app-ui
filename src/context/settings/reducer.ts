import { Reducer } from 'react';
import { PREFERRED_UNIT } from '../../enum/PREFERRED_UNIT';
import { PREFERRED_UNIT_VALUE } from '../../enum/PREFERRED_UNIT_VALUE';
import { SELECTED_THEME } from '../../enum/SELECTED_THEME';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { SetPreferredUnitAction, SetSlippageAction, SetThemeAction, SettingsStore } from './types';

const { getLocalData, setLocalData } = useLocalStorage<SettingsStore>('BmSettings');
const settings = getLocalData();

export const initialSettingsState: SettingsStore = {
  slippage: settings?.slippage || 200,
  preferred_unit: settings?.preferred_unit || { text: PREFERRED_UNIT.LBTC, value: PREFERRED_UNIT_VALUE.LBTC },
  theme: settings?.theme || SELECTED_THEME.NEON,
};

export const settingsReducer: Reducer<SettingsStore, SetPreferredUnitAction | SetSlippageAction | SetThemeAction> = (
  state: SettingsStore = initialSettingsState,
  action: SetPreferredUnitAction | SetSlippageAction | SetThemeAction,
): SettingsStore => {
  switch (action.type) {
    case 'SET_SLIPPAGE':
      setLocalData({
        slippage: action.payload,
        preferred_unit: state.preferred_unit,
        theme: state.theme,
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
      });
      document.documentElement.setAttribute('theme', action.payload);
      return {
        ...state,
        theme: action.payload,
      };

    default:
      return state;
  }
};
