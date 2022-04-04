import { PREFERRED_UNIT } from '../../enum/PREFERRED_UNIT';
import { SELECTED_THEME } from '../../enum/SELECTED_THEME';

export const SET_SLIPPAGE = 'SET_SLIPPAGE';
export const SET_PREFERRED_UNIT = 'SET_PREFERRED_UNIT';
export const SET_THEME = 'SET_THEME';

export type SettingsStore = {
  slippage: number;
  preferred_unit: { text: PREFERRED_UNIT; value: number };
  theme: SELECTED_THEME;
};

export type SetSlippageAction = {
  type: typeof SET_SLIPPAGE;
  payload: number;
};

export type SetPreferredUnitAction = {
  type: typeof SET_PREFERRED_UNIT;
  payload: { text: PREFERRED_UNIT; value: number };
};

export type SetThemeAction = {
  type: typeof SET_THEME;
  payload: SELECTED_THEME;
};

export interface ISettingsContext {
  settingsContext: SettingsStore;
  setSlippageContext: (slippage: number) => void;
  setPreferredUnitContext: (preferred_unit: { text: PREFERRED_UNIT; value: number }) => void;
  setThemeContext: (theme: SELECTED_THEME) => void;
}
