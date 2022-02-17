import { Balance } from 'marina-provider';
import { IWallet } from '../../lib/wallet/IWallet';
import { SetWalletAction, SET_WALLET } from './types';

export const setWalletAction = (
  wallet: { marina: IWallet; isEnabled: boolean; balances: Balance[] },
  dispatch: (action: SetWalletAction) => void,
): void => {
  dispatch({
    type: SET_WALLET,
    payload: wallet,
  });
};
