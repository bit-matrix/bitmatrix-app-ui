import { IWallet } from "./IWallet";
import Marina from "./marina/marina";
import { WALLET_NAME } from "./WALLET_NAME";

export class Wallet implements IWallet {
  private wallet: IWallet;

  constructor(walletName: WALLET_NAME = WALLET_NAME.MARINA) {
    if (walletName === WALLET_NAME.MARINA) this.wallet = new Marina();
    // TODO default wallet
    else this.wallet = new Marina();
  }

  public exist = () => this.wallet.exist();

  public isEnabled = () => this.wallet.isEnabled();

  public enable = () => this.wallet.enable();

  public disable = () => this.wallet.disable();

  public getNextAddress = () => this.wallet.getNextAddress();

  public getAddresses = () => this.wallet.getAddresses();
}
