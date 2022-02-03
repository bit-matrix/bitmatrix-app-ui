import { Balance, EventListenerID, MarinaEventType } from 'marina-provider';
import { MarinaAddressInterface, MarinaTransactionHex, Recipient } from './marina/IMarina';

export interface IWallet {
  exist(): boolean;

  on(type: MarinaEventType, callback: (payload: any) => void): EventListenerID;

  off(listenerId: EventListenerID): void;

  isEnabled(): Promise<boolean>;

  enable(): Promise<void>;

  disable(): Promise<void>;

  getNextAddress(): Promise<MarinaAddressInterface>;

  getAddresses(): Promise<MarinaAddressInterface[]>;

  sendTransaction(recipients: Recipient[]): Promise<MarinaTransactionHex>;

  getBalances(): Promise<Balance[]>;
}
