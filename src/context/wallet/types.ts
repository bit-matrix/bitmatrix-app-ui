import { Balance } from 'marina-provider';
import { IWallet } from '../../lib/wallet/IWallet';

export const SET_WALLET = 'SET_WALLET';

export type SetWalletAction = {
  type: typeof SET_WALLET;
  payload: { marina: IWallet; isEnabled: boolean; balances: Balance[] };
};

export interface IWalletContext {
  walletContext?: { marina: IWallet; isEnabled: boolean; balances: Balance[] };
  setWalletContext: (wallet: { marina: IWallet; isEnabled: boolean; balances: Balance[] }) => void;
}
