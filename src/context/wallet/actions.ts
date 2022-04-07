import { Wallet } from './types';
import { SetWalletAction, SET_WALLET } from './types';

export const setWalletAction = (wallet: Wallet, dispatch: (action: SetWalletAction) => void): void => {
  dispatch({
    type: SET_WALLET,
    payload: wallet,
  });
};
