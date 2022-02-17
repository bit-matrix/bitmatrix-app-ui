import { PREFERRED_UNIT } from '../../enum/PREFERRED_UNIT';
import { SetPreferredUnitAction, SetSlippageAction, SET_PREFERRED_UNIT, SET_SLIPPAGE } from './types';

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
