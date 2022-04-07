import { Reducer } from 'react';
import { Wallet } from './types';
import { SetWalletAction, SET_WALLET } from './types';

export const initialWalletState = { marina: undefined, isEnabled: false, balances: [] };

export const walletReducer: Reducer<Wallet | undefined, SetWalletAction> = (
  state: Wallet | undefined,
  action: SetWalletAction,
): Wallet | undefined => {
  switch (action.type) {
    case SET_WALLET:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};
