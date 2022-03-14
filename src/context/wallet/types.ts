import { Balance } from 'marina-provider';
import { IWallet } from '../../lib/wallet/IWallet';

export const SET_WALLET = 'SET_WALLET';

export type Wallet = {
  marina: IWallet;
  isEnabled: boolean;
  balances: Balance[];
};

export type SetWalletAction = {
  type: typeof SET_WALLET;
  payload: Wallet;
};

export interface IWalletContext {
  walletContext?: Wallet;
  setWalletContext: (wallet: Wallet) => void;
}
