import { EXPLORER } from '../../enum/EXPLORER';
import { PREFERRED_UNIT } from '../../enum/PREFERRED_UNIT';
import { SELECTED_THEME } from '../../enum/SELECTED_THEME';
import { SettingsStore } from '../../model/SettingsStore';

export const SET_SLIPPAGE = 'SET_SLIPPAGE';
export const SET_PREFERRED_UNIT = 'SET_PREFERRED_UNIT';
export const SET_THEME = 'SET_THEME';
export const SET_EXCLUSIVE_THEMES = 'SET_EXCLUSIVE_THEMES';
export const SET_EXPLORER = 'SET_EXPLORER';

export type Settings = SettingsStore & {
  exclusiveThemes: string[];
  explorer: EXPLORER;
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

export type SetExclusiveThemesAction = {
  type: typeof SET_EXCLUSIVE_THEMES;
  payload: string[];
};

export type SetExplorerAction = {
  type: typeof SET_EXPLORER;
  payload: EXPLORER;
};

export interface ISettingsContext {
  settingsContext: Settings;
  setSlippageContext: (slippage: number) => void;
  setPreferredUnitContext: (preferred_unit: { text: PREFERRED_UNIT; value: number }) => void;
  setThemeContext: (theme: SELECTED_THEME) => void;
  setExclusiveThemesContext: (exclusiveThemes: string[]) => void;
  setExplorerContext: (explorer: EXPLORER) => void;
}
