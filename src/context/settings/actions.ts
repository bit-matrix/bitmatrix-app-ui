import { PREFERRED_UNIT } from '../../enum/PREFERRED_UNIT';
import { SELECTED_THEME } from '../../enum/SELECTED_THEME';

import {
  SetPreferredUnitAction,
  SetSlippageAction,
  SetThemeAction,
  SET_PREFERRED_UNIT,
  SET_SLIPPAGE,
  SET_THEME,
} from './types';

export const setSlippageAction = (slippage: number, dispatch: (action: SetSlippageAction) => void): void => {
  dispatch({
    type: SET_SLIPPAGE,
    payload: slippage,
  });
};

export const setPreferredUnitAction = (
  preferred_unit: { text: PREFERRED_UNIT; value: number },
  dispatch: (action: SetPreferredUnitAction) => void,
): void => {
  dispatch({
    type: SET_PREFERRED_UNIT,
    payload: preferred_unit,
  });
};

export const setThemeAction = (theme: SELECTED_THEME, dispatch: (action: SetThemeAction) => void): void => {
  dispatch({
    type: SET_THEME,
    payload: theme,
  });
};
