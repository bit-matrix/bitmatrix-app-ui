import { Reducer } from 'react';
import { SetBtcPriceAction, SET_BTC_PRICE } from './types';

export const btcPriceReducer: Reducer<number, SetBtcPriceAction> = (
  state: number,
  action: SetBtcPriceAction,
): number => {
  switch (action.type) {
    case SET_BTC_PRICE:
      return action.payload;

    default:
      return state;
  }
};
