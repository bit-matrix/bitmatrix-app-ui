import {
  AddressInterface,
  Balance,
  EventListenerID,
  MarinaEventType,
  MarinaProvider,
  NetworkString,
  Recipient,
  SignedMessage,
  Transaction,
  TransactionID,
  Utxo,
} from 'marina-provider';

declare global {
  interface Window {
    marina?: MarinaProvider;
  }
}

export const marina = window.marina;

export default class Marina implements MarinaProvider {
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

  getNextAddress(): Promise<AddressInterface> {
    if (this.exist() && this.marina) return this.marina.getNextAddress();
    // else throw "Install Marina first";
    throw new Error('Marina wallet disabled.');
  }

  getAddresses(): Promise<AddressInterface[]> {
    if (this.exist() && this.marina) return this.marina.getAddresses();
    // else throw "Install Marina first";
    throw new Error('Marina wallet disabled.');
  }

  sendTransaction(recipients: Recipient[]): Promise<TransactionID> {
    if (this.exist() && this.marina) return this.marina.sendTransaction(recipients);
    // else throw "Install Marina first";
    throw new Error('Marina wallet disabled.');
  }

  getNextChangeAddress(): Promise<AddressInterface> {
    if (this.exist() && this.marina) return this.marina.getNextChangeAddress();

    throw new Error('Marina wallet disabled.');
  }

  getBalances(): Promise<Balance[]> {
    if (this.exist() && this.marina) return this.marina.getBalances();
    // else throw "Install Marina first";
    throw new Error('Marina wallet disabled.');
  }

  setAccount(/*account: number*/): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getNetwork(): Promise<NetworkString> {
    throw new Error('Method not implemented.');
  }

  blindTransaction(/*pset: string*/): Promise<string> {
    throw new Error('Method not implemented.');
  }
  signTransaction(/*pset: string*/): Promise<string> {
    throw new Error('Method not implemented.');
  }
  signMessage(/*message: string*/): Promise<SignedMessage> {
    throw new Error('Method not implemented.');
  }
  getCoins(): Promise<Utxo[]> {
    throw new Error('Method not implemented.');
  }
  getTransactions(): Promise<Transaction[]> {
    throw new Error('Method not implemented.');
  }
  getFeeAssets(): Promise<string[]> {
    throw new Error('Method not implemented.');
  }
}
