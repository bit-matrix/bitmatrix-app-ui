export interface IWallet {
  exist(): boolean;

  isEnabled(): Promise<boolean>;

  enable(): Promise<void>;

  disable(): Promise<void>;
}
