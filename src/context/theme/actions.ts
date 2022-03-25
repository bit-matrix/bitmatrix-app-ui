import { SELECTED_THEME } from '../../enum/SELECTED_THEME';
import { SetThemeAction, SET_THEME } from './types';

export const setThemeAction = (theme: SELECTED_THEME, dispatch: (action: SetThemeAction) => void): void => {
  dispatch({
    type: SET_THEME,
    payload: theme,
  });
};
