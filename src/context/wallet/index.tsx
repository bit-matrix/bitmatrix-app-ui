import React, { ComponentProps, createContext, FC, useContext, useReducer } from 'react';
import { Wallet } from './types';
import { setWalletAction } from './actions';
import { walletReducer } from './reducer';
import { IWalletContext } from './types';

type Props = {
  children: React.ReactNode;
};

const WalletContext = createContext<IWalletContext>({} as IWalletContext);

export const useWalletContext = (): IWalletContext => useContext(WalletContext);

export const WalletContextProvider: React.FC<Props> = ({ children }: ComponentProps<FC>): JSX.Element => {
  const [walletContext, dispatch] = useReducer(walletReducer, undefined);

  const setWalletContext = (wallet: Wallet): void => {
    setWalletAction(wallet, dispatch);
  };

  return <WalletContext.Provider value={{ walletContext, setWalletContext }}>{children}</WalletContext.Provider>;
};
