import { PREFERRED_UNIT } from '../../enum/PREFERRED_UNIT';
import { SettingsStore } from '../../model/SettingsStore';

export const SET_SLIPPAGE = 'SET_SLIPPAGE';
export const SET_PREFERRED_UNIT = 'SET_PREFERRED_UNIT';

export interface SetSlippageAction {
  type: typeof SET_SLIPPAGE;
  payload: number;
}

export interface SetPreferredUnitAction {
  type: typeof SET_PREFERRED_UNIT;
  payload: { text: PREFERRED_UNIT; value: number };
}

export interface ISettingsContext {
  settings: SettingsStore;
  setSlippage: (slippage: number) => void;
  setPreferredUnit: (preferred_unit: { text: PREFERRED_UNIT; value: number }) => void;
}
