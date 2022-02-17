import { Balance } from 'marina-provider';
import { IWallet } from '../../lib/wallet/IWallet';
import { SetWalletAction, SET_WALLET } from './types';

export const initialWalletState = { marina: undefined, isEnabled: false, balances: [] };

export const walletReducer = (
  state: { marina: IWallet; isEnabled: boolean; balances: Balance[] } | undefined,
  action: SetWalletAction,
): { marina: IWallet; isEnabled: boolean; balances: Balance[] } | undefined => {
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
