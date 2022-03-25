import { SELECTED_THEME } from '../../enum/SELECTED_THEME';

export const SET_THEME = 'SET_THEME';

export type SetThemeAction = {
  type: typeof SET_THEME;
  payload: SELECTED_THEME;
};

export interface IThemeContext {
  themeContext: SELECTED_THEME;
  setThemeContext: (theme: SELECTED_THEME) => void;
}
