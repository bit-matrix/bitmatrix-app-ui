import { AddressInterface, Balance, EventListenerID, MarinaEventType, Recipient, TransactionID } from 'marina-provider';

export interface IWallet {
  exist(): boolean;

  on(type: MarinaEventType, callback: (payload: any) => void): EventListenerID;

  off(listenerId: EventListenerID): void;

  isEnabled(): Promise<boolean>;

  enable(): Promise<void>;

  disable(): Promise<void>;

  getNextAddress(): Promise<AddressInterface>;

  getAddresses(): Promise<AddressInterface[]>;

  sendTransaction(recipients: Recipient[]): Promise<TransactionID>;

  getBalances(): Promise<Balance[]>;
}
