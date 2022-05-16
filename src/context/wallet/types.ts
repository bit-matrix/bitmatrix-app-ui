import { Balance } from 'marina-provider';
import { Wallet as MarinaWallet } from '@bitmatrix/lib';

export const SET_WALLET = 'SET_WALLET';

export type Wallet = {
  marina: MarinaWallet;
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
