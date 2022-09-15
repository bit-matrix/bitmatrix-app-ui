import { SetBtcPriceAction, SET_BTC_PRICE } from './types';

export const setBtcPriceAction = (value: number, dispatch: (action: SetBtcPriceAction) => void): void => {
  dispatch({
    type: SET_BTC_PRICE,
    payload: value,
  });
};
