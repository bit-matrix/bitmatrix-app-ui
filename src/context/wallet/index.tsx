import { Balance } from 'marina-provider';
import { ComponentProps, createContext, FC, useContext, useReducer } from 'react';
import { IWallet } from '../../lib/wallet/IWallet';
import { setWalletAction } from './actions';
import { walletReducer } from './reducer';
import { IWalletContext } from './types';

const WalletContext = createContext<IWalletContext>({} as IWalletContext);

export const useWalletContext = (): IWalletContext => useContext(WalletContext);

export const WalletContextProvider: React.FC = ({ children }: ComponentProps<FC>): JSX.Element => {
  const [walletContext, dispatch] = useReducer(walletReducer, undefined);

  const setWalletContext = (wallet: { marina: IWallet; isEnabled: boolean; balances: Balance[] }): void => {
    setWalletAction(wallet, dispatch);
  };

  return <WalletContext.Provider value={{ walletContext, setWalletContext }}>{children}</WalletContext.Provider>;
};
