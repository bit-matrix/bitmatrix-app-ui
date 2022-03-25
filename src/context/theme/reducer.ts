import { Reducer } from 'react';
import { SELECTED_THEME } from '../../enum/SELECTED_THEME';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { SetThemeAction } from './types';

const { getLocalData, setLocalData } = useLocalStorage<SELECTED_THEME>('theme');
const themeLocalData = getLocalData();

export const initialThemeState: SELECTED_THEME = themeLocalData || SELECTED_THEME.NEON;

export const themeReducer: Reducer<SELECTED_THEME, SetThemeAction> = (
  state: SELECTED_THEME = initialThemeState,
  action: SetThemeAction,
): SELECTED_THEME => {
  switch (action.type) {
    case 'SET_THEME':
      setLocalData(action.payload);
      document.documentElement.setAttribute('theme', action.payload);
      return action.payload;

    default:
      return state;
  }
};
