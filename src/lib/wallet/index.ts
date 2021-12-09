import { IWallet } from './IWallet';
import {
  MarinaAddressInterface,
  MarinaTransactionHex,
  Recipient,
} from './marina/IMarina';
import Marina from './marina/marina';
import { WALLET_NAME } from './WALLET_NAME';

export class Wallet implements IWallet {
  private wallet: IWallet;

  constructor(walletName: WALLET_NAME = WALLET_NAME.MARINA) {
    if (walletName === WALLET_NAME.MARINA) this.wallet = new Marina();
    // TODO default wallet
    else this.wallet = new Marina();
  }

  public exist = (): boolean => this.wallet.exist();

  public isEnabled = (): Promise<boolean> => this.wallet.isEnabled();

  public enable = (): Promise<void> => this.wallet.enable();

  public disable = (): Promise<void> => this.wallet.disable();

  public getNextAddress = (): Promise<MarinaAddressInterface> =>
    this.wallet.getNextAddress();

  public getAddresses = (): Promise<MarinaAddressInterface[]> =>
    this.wallet.getAddresses();

  public sendTransaction = (
    recipient: Recipient[],
  ): Promise<MarinaTransactionHex> => this.wallet.sendTransaction(recipient);
}
