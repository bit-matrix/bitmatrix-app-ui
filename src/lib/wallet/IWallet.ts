import { MarinaAddressInterface } from "./marina/IMarina";

export interface IWallet {
  exist(): boolean;

  isEnabled(): Promise<boolean>;

  enable(): Promise<void>;

  disable(): Promise<void>;

  getNextAddress(): Promise<MarinaAddressInterface>;

  getAddresses(): Promise<MarinaAddressInterface[]>;
}
