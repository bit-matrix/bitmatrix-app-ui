import { Balance, EventListenerID, MarinaEventType } from 'marina-provider';
import { IWallet } from '../IWallet';
import { MarinaAddressInterface, MarinaProvider, MarinaTransactionHex, Recipient } from './IMarina';

declare global {
  interface Window {
    marina?: MarinaProvider;
  }
}

export const marina = window.marina;

export default class Marina implements IWallet {
  private marina: MarinaProvider | undefined;

  constructor() {
    this.marina = window.marina;
  }

  on = (type: MarinaEventType, callback: (payload: any) => void): string => {
    if (this.exist() && marina) return marina.on(type, callback);

    return 'Marina wallet disabled.';
  };

  off = (listenerId: EventListenerID): void => {
    if (this.exist() && marina) marina.off(listenerId);
  };

  exist = (): boolean => typeof window.marina !== 'undefined';

  isEnabled = (): Promise<boolean> => {
    if (this.exist() && marina) return marina.isEnabled();
    // throw "Install Marina first";
    return Promise.resolve(false);
  };

  enable = (): Promise<void> => {
    if (this.exist() && this.marina) return this.marina.enable();
    // else throw "Install Marina first";
    return Promise.resolve();
  };

  disable = (): Promise<void> => {
    if (this.exist() && this.marina) return this.marina.disable();
    // else throw "Install Marina first";
    return Promise.resolve();
  };

  getNextAddress(): Promise<MarinaAddressInterface> {
    if (this.exist() && this.marina) return this.marina.getNextAddress();
    // else throw "Install Marina first";
    throw new Error('Marina wallet disabled.');
  }

  getAddresses(): Promise<MarinaAddressInterface[]> {
    if (this.exist() && this.marina) return this.marina.getAddresses();
    // else throw "Install Marina first";
    throw new Error('Marina wallet disabled.');
  }

  sendTransaction(recipients: Recipient[]): Promise<MarinaTransactionHex> {
    if (this.exist() && this.marina) return this.marina.sendTransaction(recipients);
    // else throw "Install Marina first";
    throw new Error('Marina wallet disabled.');
  }

  getBalances(): Promise<Balance[]> {
    if (this.exist() && this.marina) return this.marina.getBalances();
    // else throw "Install Marina first";
    throw new Error('Marina wallet disabled.');
  }
}
