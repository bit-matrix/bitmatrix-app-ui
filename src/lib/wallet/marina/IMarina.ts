import { EventListenerID, MarinaEventType } from 'marina-provider';

export type MarinaTransactionHex = string;
export type MarinaPsetBase64 = string;
export type MarinaSignatureBase64 = string;
export type MarinaNativeSegwitAddress = string;

export interface MarinaAddressInterface {
  confidentialAddress: string;
  blindingPrivateKey: string;
  derivationPath?: string;
}

export interface MarinaSignedMessage {
  signature: MarinaSignatureBase64;
  address: MarinaNativeSegwitAddress;
}

export interface Recipient {
  address: MarinaNativeSegwitAddress;
  asset: string;
  value: number;
}

export interface MarinaProvider {
  on(type: MarinaEventType, callback: (payload: any) => void): EventListenerID;

  enable(): Promise<void>;

  disable(): Promise<void>;

  isEnabled(): Promise<boolean>;

  setAccount(account: number): Promise<void>;

  getNetwork(): Promise<'liquid' | 'regtest'>;

  getAddresses(): Promise<MarinaAddressInterface[]>;

  getNextAddress(): Promise<MarinaAddressInterface>;

  getNextChangeAddress(): Promise<MarinaAddressInterface>;

  sendTransaction(recipients: Recipient[], feeAssetHash?: string): Promise<MarinaTransactionHex>;

  blindTransaction(pset: MarinaPsetBase64): Promise<MarinaPsetBase64>;

  signTransaction(pset: MarinaPsetBase64): Promise<MarinaPsetBase64>;

  signMessage(message: string): Promise<MarinaSignedMessage>;
}
