import { PREFERRED_UNIT } from '../../enum/PREFERRED_UNIT';
import { PREFERRED_UNIT_VALUE } from '../../enum/PREFERRED_UNIT_VALUE';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { SettingsStore } from '../../model/SettingsStore';
import { SetPreferredUnitAction, SetSlippageAction } from './types';

const { getLocalData, setLocalData } = useLocalStorage<SettingsStore>('BmSettings');
const settings = getLocalData();

export const initialSettingsState: SettingsStore = {
  slippage: settings?.slippage || 200,
  preferred_unit: settings?.preferred_unit || { text: PREFERRED_UNIT.LBTC, value: PREFERRED_UNIT_VALUE.LBTC },
};

export const settingsReducer = (
  state: SettingsStore = initialSettingsState,
  action: SetPreferredUnitAction | SetSlippageAction,
): SettingsStore => {
  switch (action.type) {
    case 'SET_SLIPPAGE':
      setLocalData({
        slippage: action.payload,
        preferred_unit: state.preferred_unit,
      });
      return {
        ...state,
        slippage: action.payload,
      };

    case 'SET_PREFERRED_UNIT':
      setLocalData({
        slippage: state.slippage,
        preferred_unit: action.payload,
      });

      return {
        ...state,
        preferred_unit: action.payload,
      };

    default:
      return state;
  }
};
