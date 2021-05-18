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

export interface MarinaProvider {
  enable(): Promise<void>;

  disable(): Promise<void>;

  isEnabled(): Promise<boolean>;

  setAccount(account: number): Promise<void>;

  getNetwork(): Promise<"liquid" | "regtest">;

  getAddresses(): Promise<MarinaAddressInterface[]>;

  getNextAddress(): Promise<MarinaAddressInterface>;

  getNextChangeAddress(): Promise<MarinaAddressInterface>;

  sendTransaction(recipientAddress: string, amountInSatoshis: number, assetHash: string): Promise<MarinaTransactionHex>;

  blindTransaction(pset: MarinaPsetBase64): Promise<MarinaPsetBase64>;

  signTransaction(pset: MarinaPsetBase64): Promise<MarinaPsetBase64>;

  signMessage(message: string): Promise<MarinaSignedMessage>;
}
